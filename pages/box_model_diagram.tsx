import { useRouter } from 'next/router'
import React from 'react'
import { deserialize } from '../utils/serialize'
import styled from 'styled-components'
import BoxModelDiagram, { CSSDeclaration } from '../components/BoxModelDiagram'
import { parseHashStringParameters } from '../utils/url'

const Container = styled.div({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
})

const Inner = styled.div({
  flex: '1 1 auto',
  maxWidth: '900px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

function getProps(
  asPath: string
):
  | {
      declarations: CSSDeclaration[]
      content?: React.ReactNode
    }
  | undefined {
  const data = parseHashStringParameters(asPath).data

  if (!data) return

  const parsed = JSON.parse(data)

  return {
    declarations: parsed.declarations,
    content: parsed.content ? deserialize(parsed.content) : undefined,
  }
}

export default function BoxModelDiagramPage() {
  const router = useRouter()
  const { declarations = [], content } = getProps(router.asPath) || {}

  return (
    <Container>
      <Inner>
        <BoxModelDiagram
          popOut={false}
          declarations={declarations}
          content={content}
        />
      </Inner>
    </Container>
  )
}
