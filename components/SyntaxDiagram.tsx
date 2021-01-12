import { ExternalLinkIcon } from '@modulz/radix-icons'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Caret, HorizontalSpacer, mediaQuery } from 'react-guidebook'
import styled, { CSSProperties, useTheme } from 'styled-components'

type ContextValue = {
  selectedId?: string
  activeTokenStyle?: CSSProperties
  showToolTips: boolean
  onMouseEnter: (id: string) => void
  onInput: () => void
}

const SyntaxTokenContext = createContext<ContextValue>({
  onMouseEnter: () => {},
  onInput: () => {},
  showToolTips: true,
})

interface StyledToken {
  id: string
  label?: React.ReactNode
  style?: CSSProperties
  activeStyle?: CSSProperties
  value: Token[]
  editable?: boolean
}

export type Token = StyledToken | string

function Tooltip({ children }: { children?: React.ReactNode }) {
  const theme = useTheme()

  return (
    <span
      style={{
        top: '100%',
        left: '50%',
        // right: '0',
        position: 'absolute',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          position: 'relative',
          left: '-50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            display: 'block',
            height: '6px',
            width: '12px',
          }}
        >
          <span
            style={{
              width: '12px',
              border: '6px solid #000',
              borderColor: `transparent transparent ${theme.colors.text} transparent`,
              position: 'absolute',
              top: '-6px',
            }}
          />
        </span>
        <span
          style={{
            ...theme.textStyles.body,
            // fontWeight: 500,
            width: 'max-content',
            background: theme.colors.text,
            boxShadow: '0 2px 3px rgba(0,0,0,0.2)',
            padding: '4px 12px',
            borderRadius: '2px',
            color: 'white',
          }}
        >
          {children}
        </span>
      </span>
    </span>
  )
}

function getTokenId(token: Token) {
  return typeof token === 'string' ? undefined : token.id
}

function SyntaxToken({ token, editable }: { token: Token; editable: boolean }) {
  const {
    selectedId,
    onMouseEnter,
    onInput,
    activeTokenStyle,
    showToolTips,
  } = useContext(SyntaxTokenContext)

  const content =
    typeof token === 'string'
      ? token
      : token.value.map((value, index) => (
          <SyntaxToken
            key={index}
            token={value}
            editable={token.editable === true && typeof value === 'string'}
          />
        ))

  const id = getTokenId(token)

  const componentStyle = useMemo((): CSSProperties | undefined => {
    return typeof token === 'string'
      ? undefined
      : {
          padding: '3px 0',
          position: 'relative',
          ...token.style,
          ...(id === selectedId && activeTokenStyle),
          ...(id === selectedId && token.activeStyle),
        }
  }, [token, selectedId, activeTokenStyle])

  const editableStyle = useMemo(
    () =>
      editable
        ? {
            // Add padding so the caret always shows up
            padding: '0 2px 0 1px',
            caretColor: 'black',
            display: 'inline-block',
          }
        : undefined,
    [editable]
  )

  const handleMove = useCallback(
    (
      event:
        | React.MouseEvent<HTMLSpanElement, MouseEvent>
        | React.TouchEvent<HTMLSpanElement>
    ) => {
      if (!id) return

      onMouseEnter(id)

      event.stopPropagation()
      event.preventDefault()
    },
    [id]
  )

  if (typeof token === 'string') {
    // Input elements can't automatically resize to fit the content,
    // so we use contentEditable here
    return (
      <span
        style={editableStyle}
        contentEditable={editable}
        suppressContentEditableWarning={true}
        spellCheck={false}
        onInput={onInput}
      >
        {content}
      </span>
    )
  }

  return (
    <span
      style={componentStyle}
      onMouseMove={handleMove}
      onTouchStart={handleMove}
      onTouchMove={handleMove}
    >
      {content}
      {showToolTips && token.id === selectedId && (
        <Tooltip>{token.label || token.id}</Tooltip>
      )}
    </span>
  )
}

const Container = styled.div(({ theme }) => ({
  ...theme.textStyles.code,
  fontSize: '1.2rem',
  backgroundColor: theme.colors.selectedBackground,
  display: 'flex',
  userSelect: 'none',
  marginBottom: `${theme.sizes.spacing.small}px`,
}))

const Menu = styled.div<{ layoutType: LayoutType }>(
  ({ theme, layoutType }) => ({
    ...(layoutType === 'split' && {
      width: '50%',
    }),
    minWidth: '180px',
    margin: '10px',
    borderRadius: '8px',
    background: 'white',
    padding: `8px ${theme.sizes.spacing.small}px`,
    // borderLeft: `1px solid ${theme.colors.divider}`,

    [mediaQuery.small]: {
      display: 'none',
    },
  })
)

const IconContainer = styled.a(({ theme }) => ({
  color: theme.colors.text,
  border: 'none',
  margin: '0',
  borderRadius: '8px',
  background: 'white',
  padding: `8px`,
  lineHeight: '0',
  position: 'absolute',
  right: 0,
  top: 10,
  cursor: 'pointer',

  [mediaQuery.small]: {
    display: 'none',
  },
}))

const MenuRow = styled.div<{ depth: number; active: boolean }>(
  ({ theme, depth, active }) => ({
    ...theme.textStyles.body,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: `${4 + depth * 20}px`,
    paddingRight: `${8}px`,
    ...(active && {
      borderRadius: '4px',
      backgroundColor: '#c5f5c5',
      // backgroundColor: 'rgba(0,0,0,0.1)',
      // textDecoration: 'underline',
    }),
  })
)

const Diagram = styled.div<{ layoutType: LayoutType }>(
  ({ theme, layoutType }) => ({
    padding: `40px`,
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: layoutType === 'split' ? 'flex-start' : 'center',
    position: 'relative',
    whiteSpace: 'pre-wrap',
    cursor: 'crosshair',
  })
)

type LayoutType = 'main-syntax' | 'split'

interface Props {
  tokens: Token[]
  popOut?: boolean | string
  showToolTips?: boolean
  showSyntaxTree?: boolean
  activeTokenStyle?: CSSProperties
  onChangeActiveToken?: (id?: string) => void
  onChangeText?: (text: string) => void
  children?: ReactNode
  selectedId?: string | undefined
  onChangeSelectedId?: (id: string | undefined) => void
  layoutType?: LayoutType
}

export default function SyntaxDiagram(props: Props) {
  const {
    tokens = [],
    popOut = true,
    showToolTips = true,
    showSyntaxTree = true,
    activeTokenStyle = {
      // backgroundColor: 'rgb(181,215,255)',
      backgroundColor: '#c5f5c5',
    },
    children,
    onChangeActiveToken = () => {},
    onChangeText = () => {},
    selectedId: externalSelectedId,
    layoutType = 'main-syntax',
  } = props

  const isControlled = 'selectedId' in props

  const [internalSelectedId, setInternalSelectedId] = useState<
    string | undefined
  >(undefined)
  const selectedId = isControlled ? externalSelectedId : internalSelectedId

  const rootSpanRef = useRef<HTMLSpanElement | null>(null)

  const onMouseEnter = useCallback((id) => {
    setInternalSelectedId(id)
    onChangeActiveToken(id)
  }, [])

  const handleLeave = useCallback(() => {
    setInternalSelectedId(undefined)
    onChangeActiveToken(undefined)
  }, [])

  const onInput = useCallback(() => {
    const rootSpan = rootSpanRef.current

    if (!rootSpan) return

    onChangeText(rootSpan.textContent || '')
  }, [])

  useEffect(() => {
    onInput()
  }, [])

  const contextValue: ContextValue = useMemo(
    () => ({
      selectedId,
      onMouseEnter,
      activeTokenStyle,
      showToolTips,
      onInput,
    }),
    [selectedId]
  )

  const menuItems = useMemo(() => {
    return createMenuItems(tokens)
  }, [tokens])

  const theme = useTheme()

  const popOutElement = useMemo(() => {
    return (
      popOut && (
        <IconContainer
          href={
            typeof popOut === 'string'
              ? popOut
              : `/syntax_diagram#data=${encodeURIComponent(
                  JSON.stringify({ tokens })
                )}`
          }
          target="_blank"
        >
          <ExternalLinkIcon />
        </IconContainer>
      )
    )
  }, [tokens, popOut])

  return (
    <SyntaxTokenContext.Provider value={contextValue}>
      <Container
        onMouseLeave={handleLeave}
        onTouchStart={handleLeave}
        onTouchMove={handleLeave}
      >
        <Diagram layoutType={layoutType}>
          <span ref={rootSpanRef}>
            {tokens.map((component, index) => (
              <SyntaxToken key={index} token={component} editable={false} />
            ))}
          </span>
          {popOutElement}
        </Diagram>
        {showSyntaxTree && (
          <Menu layoutType={layoutType}>
            {menuItems.map((item, index) => (
              <MenuRow
                key={index}
                depth={item.depth}
                active={item.id === selectedId}
                onMouseEnter={() => {
                  setInternalSelectedId(item.id)
                  onChangeActiveToken(item.id) // should this be here? why wasn't it before?
                }}
              >
                {item.hasChildren ? (
                  <Caret color={theme.colors.text} direction="down" />
                ) : (
                  <HorizontalSpacer size={14} />
                )}
                <HorizontalSpacer size={6} />
                {item.title}
              </MenuRow>
            ))}
          </Menu>
        )}
        {!showSyntaxTree && children && (
          <Menu layoutType={layoutType}>{children}</Menu>
        )}
      </Container>
    </SyntaxTokenContext.Provider>
  )
}

type MenuItem = {
  id: string
  title: React.ReactNode
  depth: number
  hasChildren: boolean
}

function createMenuItems(tokens: Token[]) {
  function flatten(tokens: Token[], depth: number): MenuItem[] {
    return tokens.flatMap((value) => {
      if (typeof value === 'string') {
        return []
      }

      const children = flatten(value.value, depth + 1)

      const menuItem: MenuItem = {
        id: value.id,
        title: value.label || value.id,
        depth,
        hasChildren: children.length > 0,
      }

      return [menuItem, ...children]
    })
  }

  return flatten(tokens, 0)
}
