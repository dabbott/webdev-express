import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import SyntaxDiagram, { Token } from '../components/SyntaxDiagram'
import { parseHashStringParameters } from '../utils/url'

function getTokens(asPath: string): Token[] | undefined {
  const data = parseHashStringParameters(asPath).data

  if (!data) return

  return JSON.parse(data).tokens
}

const Container = styled.div({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
})

export default function SyntaxDiagramPage() {
  const router = useRouter()
  const tokens = getTokens(router.asPath) || []

  return (
    <Container>
      <SyntaxDiagram tokens={tokens} popOut={false} />
    </Container>
  )
}
