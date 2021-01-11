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
`

export type CSSDeclaration = [string, string]

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
  const [highlight, setHighlight] = useState<
    'margin' | 'padding' | 'border' | 'content' | undefined
  >(undefined)

  const boxSizing = css.includes('border-box') ? 'border-box' : 'content-box'
  const highlightBorder =
    highlight === 'border' ||
    (highlight === 'content' && boxSizing === 'border-box')
  const highlightPadding =
    highlight === 'padding' ||
    (highlight === 'content' && boxSizing === 'border-box')

  useEffect(() => {
    const target = targetRef.current

    if (!target) return

    target.setAttribute('style', css)
  }, [css])

  const contentRef = useRef<HTMLDivElement | null>(null)

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
            ...(highlight === 'margin' && { backgroundColor: colors.margin }),
          }}
          onMouseMove={(e) => {
            e.stopPropagation()
            setHighlight('margin')
            setSelectedId('margin')
          }}
        >
          <Box
            value={css}
            style={{
              position: 'relative',
              backgroundColor: highlightPadding ? colors.padding : 'white',
              ...(highlightBorder && {
                borderColor: colors.border,
              }),
              ...(boxSizing === 'border-box' &&
                highlight === 'content' && {
                  backgroundColor: colors.content,
                  borderColor: colors.content,
                }),
            }}
            onMouseMove={(e) => {
              e.stopPropagation()
              setHighlight('border')
              setSelectedId('border')
            }}
          >
            <div
              style={{
                position: 'absolute',
                // Hover seems to trigger a little before we actually enter the element
                top: 2,
                left: 2,
                right: 2,
                bottom: 2,
              }}
              onMouseMove={(e) => {
                e.stopPropagation()

                if (!contentRef.current) return

                const boundingRect = contentRef.current.getBoundingClientRect()

                if (
                  e.clientX > boundingRect.left &&
                  e.clientX < boundingRect.right &&
                  e.clientY > boundingRect.top &&
                  e.clientY < boundingRect.bottom
                ) {
                  setHighlight('content')
                  setSelectedId('width')
                } else {
                  setHighlight('padding')
                  setSelectedId('padding')
                }
              }}
            />
            <div
              ref={contentRef}
              style={{
                backgroundColor: 'white',
                ...(highlight === 'content' && {
                  height: '100%',
                  backgroundColor: colors.content,
                }),
              }}
            >
              A div with <code style={theme.textStyles.code}>id="my-box"</code>
            </div>
          </Box>
        </div>
        Some content below
      </Preview>
    </SyntaxDiagram>
  )
}
