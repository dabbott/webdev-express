import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { useTheme } from 'styled-components'
import SyntaxDiagram, { Token } from '../components/SyntaxDiagram'

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
  ${(props) => props.value};
  pointer-events: none;
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

function MeasuredBoxDiagram({
  measuredBox,
  highlight,
  onHighlight,
}: {
  measuredBox: MeasuredBox
  highlight?: BoxModelComponent
  onHighlight: (component: BoxModelComponent) => void
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
    position: 'absolute',
    top: 0,
    left: 0,
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
    component: BoxModelComponent,
    event: React.MouseEvent<HTMLDivElement>
  ) {
    event.stopPropagation()
    onHighlight(component)
  }

  return (
    <div style={marginStyle} onMouseMove={handleHighlight.bind(null, 'margin')}>
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
  )
}

interface Props {
  declarations: CSSDeclaration[]
  popOut?: boolean
}

export default function BoxModelDiagram({ declarations, popOut }: Props) {
  const tokens: Token[] = useMemo(
    () => [
      {
        id: 'Rule',
        value: [
          {
            id: 'Selector',
            style: { color: '#2e9f74' },
            value: ['#my-box'],
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
  const [highlight, setHighlight] = useState<BoxModelComponent | undefined>(
    undefined
  )

  const boxSizing = css.includes('border-box') ? 'border-box' : 'content-box'

  useEffect(() => {
    const target = targetRef.current

    if (!target) return

    target.setAttribute('style', css)
  }, [css])

  const boxRef = useRef<HTMLDivElement | null>(null)
  const [measuredBox, setMeasuredBox] = useState<MeasuredBox | undefined>()

  useEffect(() => {
    if (!boxRef.current) return

    const style = window.getComputedStyle(boxRef.current)

    const measured: MeasuredBox = {
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

    setMeasuredBox(measured)
  }, [css])

  const theme = useTheme()

  return (
    <SyntaxDiagram
      selectedId={selectedId}
      tokens={tokens}
      popOut={
        popOut === undefined
          ? `/box_model_diagram#data=${encodeURIComponent(
              JSON.stringify({ declarations })
            )}`
          : popOut
      }
      showSyntaxTree={false}
      showToolTips={false}
      onChangeText={(text) => {
        setCss(text.slice('#my-box {'.length + 2, -1))
      }}
      onChangeActiveToken={(id) => {
        setSelectedId(id)

        if (id?.endsWith('margin')) {
          setHighlight('margin')
        } else if (id?.endsWith('padding')) {
          setHighlight('padding')
        } else if (id?.endsWith('border')) {
          setHighlight('border')
        } else if (id?.endsWith('width') || id?.endsWith('height')) {
          setHighlight('content')
        } else {
          setHighlight(undefined)
        }
      }}
    >
      <Preview>
        Some content above
        <div
          style={{
            display: 'flow-root',
            position: 'relative',
          }}
        >
          {measuredBox && (
            <MeasuredBoxDiagram
              highlight={highlight}
              measuredBox={measuredBox}
              onHighlight={setHighlight}
            />
          )}
          <Box ref={boxRef} value={css}>
            A div with <code style={theme.textStyles.code}>id="my-box"</code>
          </Box>
        </div>
        Some content below
      </Preview>
    </SyntaxDiagram>
  )
}
