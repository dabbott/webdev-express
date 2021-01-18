import React from 'react'
import { parseQueryParameters, parseUrl, useRouter } from 'react-guidebook'
import styled from 'styled-components'
import SyntaxDiagram, { Token } from '../components/SyntaxDiagram'

const Container = styled.div({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
})

function getTokens(fragment: string): Token[] | undefined {
  const data = parseQueryParameters(fragment).data

  if (!data) return

  return JSON.parse(data).tokens
}

export default function SyntaxDiagramPage() {
  const router = useRouter()
  const { fragment } = parseUrl(router.clientPath)
  const tokens = getTokens(fragment) || []

  return (
    <Container>
      <SyntaxDiagram tokens={tokens} popOut={false} />
    </Container>
  )
}
