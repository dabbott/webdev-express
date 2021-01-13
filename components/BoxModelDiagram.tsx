/// <reference types="resize-observer-browser" />
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { useTheme } from 'styled-components'
import SyntaxDiagram, { Token } from '../components/SyntaxDiagram'
import { serialize } from '../utils/serialize'

const colors = {
  margin: '#f8cb9c',
  border: '#fddf86' /* '#feedbb' */,
  padding: '#c2ddb6',
  content: '#9fc4e7',
}

const Preview = styled.div(({ theme }) => ({
  ...theme.textStyles.body,
  background: 'rgba(0,0,0,0.04)',
  height: '100%',
}))

const Box = styled.div<{ value: string }>`
  pointer-events: none;
  box-sizing: content-box;
  background-color: #ddd;
  ${(props) => props.value};
`

export type CSSDeclaration = [string, string]

type BoxSizing = 'border-box' | 'content-box'

type MeasuredBox = {
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  borderTopWidth: number
  borderRightWidth: number
  borderBottomWidth: number
  borderLeftWidth: number
  width: number
  height: number
  boxSizing: BoxSizing
}

type BoxModelComponent = 'margin' | 'padding' | 'border' | 'content'
type FlexComponent = 'justify-content' | 'align-items' | 'flex-direction'

type Axis = 'row' | 'column'

function AnnotatedOverlay({
  width,
  height,
  axis,
  stroke,
}: {
  width: number
  height: number
  axis: Axis
  stroke: string
}) {
  const midpoint = {
    x: width / 2,
    y: height / 2,
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id={`arrow-${stroke}`}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="3"
            markerHeight="3"
            fill={stroke}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <polyline
          points={
            axis === 'column'
              ? `${midpoint.x},0 ${midpoint.x},${height - 8}`
              : `0,${midpoint.y} ${width - 8},${midpoint.y}`
          }
          fill="none"
          stroke={stroke}
          stroke-width="4"
          // marker-start="url(#arrow)"
          marker-end={`url(#arrow-${stroke})`}
        />
      </svg>
    </div>
  )
}

type Tooltip = {
  content: React.ReactNode
  location: 'N' | 'E' | 'S' | 'W'
  color?: string
}

function MeasuredBoxDiagram({
  measuredBox,
  highlight,
  onHighlight,
  tooltips,
  axis,
  crossAxis,
}: {
  measuredBox: MeasuredBox
  highlight?: BoxModelComponent | FlexComponent
  onHighlight: (
    component: BoxModelComponent | FlexComponent | undefined
  ) => void
  tooltips: Tooltip[]
  axis?: Axis
  crossAxis?: Axis
}) {
  const highlightColors = {
    margin: highlight === 'margin' ? colors.margin : 'transparent',
    border:
      highlight === 'border'
        ? colors.border
        : highlight === 'content' && measuredBox.boxSizing === 'border-box'
        ? colors.content
        : 'transparent',
    padding:
      highlight === 'padding'
        ? colors.padding
        : highlight === 'content' && measuredBox.boxSizing === 'border-box'
        ? colors.content
        : 'transparent',
    content: highlight === 'content' ? colors.content : 'transparent',
  }

  const marginStyle: CSSProperties = {
    opacity: 0.7,
    width: 'fit-content',
    borderTop: `${measuredBox.marginTop}px solid ${highlightColors.margin}`,
    borderRight: `${measuredBox.marginRight}px solid ${highlightColors.margin}`,
    borderBottom: `${measuredBox.marginBottom}px solid ${highlightColors.margin}`,
    borderLeft: `${measuredBox.marginLeft}px solid ${highlightColors.margin}`,
  }

  const borderStyle: CSSProperties = {
    width: 'fit-content',
    borderTop: `${measuredBox.borderTopWidth}px solid ${highlightColors.border}`,
    borderRight: `${measuredBox.borderRightWidth}px solid ${highlightColors.border}`,
    borderBottom: `${measuredBox.borderBottomWidth}px solid ${highlightColors.border}`,
    borderLeft: `${measuredBox.borderLeftWidth}px solid ${highlightColors.border}`,
  }

  const paddingStyle: CSSProperties = {
    width: 'fit-content',
    borderTop: `${measuredBox.paddingTop}px solid ${highlightColors.padding}`,
    borderRight: `${measuredBox.paddingRight}px solid ${highlightColors.padding}`,
    borderBottom: `${measuredBox.paddingBottom}px solid ${highlightColors.padding}`,
    borderLeft: `${measuredBox.paddingLeft}px solid ${highlightColors.padding}`,
  }

  const fullHeight =
    measuredBox.marginTop +
    measuredBox.marginBottom +
    measuredBox.borderTopWidth +
    measuredBox.borderBottomWidth +
    measuredBox.paddingTop +
    measuredBox.paddingBottom +
    measuredBox.height

  const fullWidth =
    measuredBox.marginRight +
    measuredBox.marginLeft +
    measuredBox.borderRightWidth +
    measuredBox.borderLeftWidth +
    measuredBox.paddingRight +
    measuredBox.paddingLeft +
    measuredBox.width

  const contentStyle: CSSProperties = {
    width:
      measuredBox.boxSizing === 'content-box'
        ? `${measuredBox.width}px`
        : `${
            measuredBox.width -
            (measuredBox.paddingLeft +
              measuredBox.paddingRight +
              measuredBox.borderLeftWidth +
              measuredBox.borderRightWidth)
          }px`,
    height:
      measuredBox.boxSizing === 'content-box'
        ? `${measuredBox.height}px`
        : `${
            measuredBox.height -
            (measuredBox.paddingTop +
              measuredBox.paddingBottom +
              measuredBox.borderTopWidth +
              measuredBox.borderBottomWidth)
          }px`,
    background: highlightColors.content,
  }

  function handleHighlight(
    component: BoxModelComponent | undefined,
    event: React.MouseEvent<HTMLDivElement>
  ) {
    event.stopPropagation()
    onHighlight(component)
  }

  const theme = useTheme()

  const tooltipElements = tooltips.map((tooltip, i) => {
    return (
      <div
        key={tooltip.location}
        style={{
          position: 'absolute',
          top:
            tooltip.location === 'N'
              ? '0%'
              : tooltip.location === 'E' || tooltip.location === 'W'
              ? '50%'
              : '100%',
          left:
            tooltip.location === 'W'
              ? '0%'
              : tooltip.location === 'N' || tooltip.location === 'S'
              ? '50%'
              : '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            left: '-50%',
            top: '-17px',
          }}
        >
          <div
            style={{
              ...theme.textStyles.body,
              // fontWeight: 500,
              width: 'max-content',
              background: tooltip.color || theme.colors.text,
              boxShadow: '0 2px 3px rgba(0,0,0,0.2)',
              padding: '4px 12px',
              borderRadius: '2px',
              color: 'white',
            }}
          >
            {tooltip.content}
          </div>
        </div>
      </div>
    )
  })

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 'fit-content',
        height: 'fit-content',
      }}
    >
      <div
        style={marginStyle}
        onMouseMove={handleHighlight.bind(null, 'margin')}
        onMouseLeave={handleHighlight.bind(null, undefined)}
      >
        <div
          style={borderStyle}
          onMouseMove={handleHighlight.bind(null, 'border')}
        >
          <div
            style={paddingStyle}
            onMouseMove={handleHighlight.bind(null, 'padding')}
          >
            <div
              style={contentStyle}
              onMouseMove={handleHighlight.bind(null, 'content')}
            />
          </div>
        </div>
      </div>
      {crossAxis && (
        <AnnotatedOverlay
          width={fullWidth}
          height={fullHeight}
          axis={crossAxis}
          stroke={'gray'}
        />
      )}
      {axis && (
        <AnnotatedOverlay
          width={fullWidth}
          height={fullHeight}
          axis={axis}
          stroke={'black'}
        />
      )}
      {tooltipElements}
    </div>
  )
}

interface Props {
  declarations: CSSDeclaration[]
  popOut?: boolean
  above?: React.ReactNode
  below?: React.ReactNode
  content?: React.ReactNode
  selector?: string
}

export default function BoxModelDiagram({
  declarations,
  popOut,
  selector = '#my-box',
  above,
  below,
  content,
}: Props) {
  const tokens: Token[] = useMemo(
    () => [
      {
        id: 'Rule',
        value: [
          {
            id: 'Selector',
            style: { color: '#2e9f74' },
            value: [selector],
          },
          ' {\n',
          ...declarations.flatMap(([key, value]) => [
            '  ',
            {
              id: key,
              value: [
                { editable: true, id: `property-${key}`, value: [key] },
                ': ',
                {
                  editable: true,
                  id: `value-${key}`,
                  value: [value],
                  style: { color: '#c92c2c' },
                },
                ';',
              ],
            },
            '\n',
          ]),
          '}',
        ],
      },
    ],
    [declarations]
  )

  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [css, setCss] = useState('')
  const targetRef = useRef<HTMLDivElement | null>(null)
  const [highlight, setHighlight] = useState<
    BoxModelComponent | FlexComponent | undefined
  >(undefined)

  useEffect(() => {
    const target = targetRef.current

    if (!target) return

    target.setAttribute('style', css)
  }, [css])

  const boxRef = useRef<HTMLDivElement | null>(null)
  const [computedStyle, setComputedStyle] = useState<
    CSSStyleDeclaration | undefined
  >()

  function updateMeasurements() {
    if (!boxRef.current) return

    const style = window.getComputedStyle(boxRef.current)

    setComputedStyle(style)
  }

  const measuredBox: MeasuredBox | undefined = useMemo(() => {
    const style = computedStyle

    if (!style) return

    return {
      marginTop: parseFloat(style.marginTop),
      marginRight: parseFloat(style.marginRight),
      marginBottom: parseFloat(style.marginBottom),
      marginLeft: parseFloat(style.marginLeft),
      borderTopWidth: parseFloat(style.borderTopWidth),
      borderRightWidth: parseFloat(style.borderRightWidth),
      borderBottomWidth: parseFloat(style.borderBottomWidth),
      borderLeftWidth: parseFloat(style.borderLeftWidth),
      paddingTop: parseFloat(style.paddingTop),
      paddingRight: parseFloat(style.paddingRight),
      paddingBottom: parseFloat(style.paddingBottom),
      paddingLeft: parseFloat(style.paddingLeft),
      width: parseFloat(style.width),
      height: parseFloat(style.height),
      boxSizing:
        style.boxSizing === 'border-box' ? 'border-box' : 'content-box',
    }
  }, [computedStyle])

  useEffect(() => {
    updateMeasurements()
  }, [css])

  useEffect(() => {
    if (!boxRef.current) return

    let resizeObserver = new ResizeObserver(() => {
      updateMeasurements()
    })

    resizeObserver.observe(boxRef.current)

    return () => {
      if (!boxRef.current) return

      resizeObserver.unobserve(boxRef.current)
    }
  }, [])

  const theme = useTheme()

  const tooltips: Tooltip[] = useMemo(() => {
    if (!computedStyle) return []

    const direction = computedStyle.flexDirection

    if (highlight === 'flex-direction') {
      return [
        { location: direction === 'row' ? 'W' : 'N', content: 'Main Axis' },
        {
          location: direction === 'row' ? 'N' : 'W',
          content: 'Cross Axis',
          color: 'gray',
        },
      ]
    } else if (highlight === 'justify-content') {
      return [
        { location: direction === 'row' ? 'W' : 'N', content: 'Start' },
        { location: direction === 'row' ? 'E' : 'S', content: 'End' },
      ]
    } else if (highlight === 'align-items') {
      return [
        {
          location: direction === 'row' ? 'N' : 'W',
          content: 'Start',
          color: 'gray',
        },
        {
          location: direction === 'row' ? 'S' : 'E',
          content: 'End',
          color: 'gray',
        },
      ]
    } else {
      return []
    }
  }, [computedStyle, highlight])

  // const isFlexComponent =
  //   highlight === 'flex-direction' ||
  //   highlight === 'justify-content' ||
  //   highlight === 'align-items'

  return (
    <SyntaxDiagram
      layoutType={'split'}
      selectedId={selectedId}
      tokens={tokens}
      popOut={
        popOut === undefined
          ? `/box_model_diagram#data=${encodeURIComponent(
              JSON.stringify({
                declarations,
                content: content ? serialize(content) : undefined,
              })
            )}`
          : popOut
      }
      showSyntaxTree={false}
      showToolTips={false}
      onChangeText={(text) => {
        setCss(text.slice(`${selector} {`.length + 2, -1))
      }}
      onChangeActiveToken={(id) => {
        setSelectedId(id)

        if (id?.includes('margin')) {
          setHighlight('margin')
        } else if (id?.includes('padding')) {
          setHighlight('padding')
        } else if (id?.includes('border')) {
          setHighlight('border')
        } else if (id?.includes('width') || id?.includes('height')) {
          setHighlight('content')
        } else if (id?.includes('align-items')) {
          setHighlight('align-items')
        } else if (id?.includes('justify-content')) {
          setHighlight('justify-content')
        } else if (id?.includes('flex-direction')) {
          setHighlight('flex-direction')
        } else {
          setHighlight(undefined)
        }
      }}
    >
      <Preview>
        {above || 'Some content above'}
        <div
          style={{
            display: 'flow-root',
            position: 'relative',
          }}
        >
          {measuredBox && (
            <MeasuredBoxDiagram
              tooltips={tooltips}
              highlight={highlight}
              measuredBox={measuredBox}
              axis={
                highlight === 'flex-direction' ||
                highlight === 'justify-content'
                  ? !computedStyle
                    ? undefined
                    : (computedStyle.flexDirection as Axis)
                  : undefined
              }
              crossAxis={
                highlight === 'flex-direction' || highlight === 'align-items'
                  ? !computedStyle
                    ? undefined
                    : computedStyle.flexDirection === 'row'
                    ? 'column'
                    : 'row'
                  : undefined
              }
              onHighlight={(highlight) => {
                setHighlight(highlight)
                setSelectedId(highlight)
              }}
            />
          )}
          <Box ref={boxRef} value={css}>
            {content || (
              <>
                A div with{' '}
                <code style={theme.textStyles.code}>id="my-box"</code>
              </>
            )}
          </Box>
        </div>
        {below || 'Some content below'}
      </Preview>
    </SyntaxDiagram>
  )
}
