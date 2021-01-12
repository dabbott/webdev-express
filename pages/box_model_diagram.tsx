import { useRouter } from 'next/router'
import React from 'react'
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
): { declarations: CSSDeclaration[] } | undefined {
  const data = parseHashStringParameters(asPath).data

  if (!data) return

  return JSON.parse(data)
}

export default function BoxModelDiagramPage() {
  const router = useRouter()
  const { declarations = [] } = getProps(router.asPath) || {}

  return (
    <Container>
      <Inner>
        <BoxModelDiagram popOut={false} declarations={declarations} />
      </Inner>
    </Container>
  )
}
