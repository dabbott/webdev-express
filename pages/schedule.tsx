import React from 'react'
import {
  Heading1,
  Heading3,
  List,
  VerticalSpacer,
  UnorderedList,
  HorizontalSpacer,
} from 'react-guidebook'
import styled from 'styled-components'

const Container = styled.div({
  height: '100vh',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '40px 40px',
  background: `linear-gradient(135deg, #607d8b, #251542)`,
})

const Inner = styled.div({
  flex: '1 1 0',
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
})

const Title = styled.h1(({ theme }) => ({
  ...theme.textStyles.title,
  display: 'inline-block', // So the gradient doesn't extend beyond the text
  backgroundColor: theme.colors.title.left, // Fallback
  backgroundImage: `linear-gradient(45deg, ${theme.colors.title.left}, ${theme.colors.title.right})`,
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  whiteSpace: 'pre',
}))

const Section = styled.section(({ theme }) => ({
  flex: '1 1 0',
  padding: '40px',
  background: 'white',
  borderRadius: '40px',
  // border: `1px solid ${theme.colors.textDecorativeLight}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.1)',
  // width: '33%',
}))

const StyledHeading = styled(Heading3)({
  marginBottom: 0,
  marginTop: '16px',
})

const StyledList = styled(List)({
  fontSize: '1.1rem',
})

const Row = styled.div({
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'row',
})

const Chunk = styled.div({
  flex: '1 1 0',
})

export default function BoxModelDiagramPage() {
  return (
    <Container>
      <Inner>
        <div
          style={{
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Section>
            <Title>{'Day 1-2: HTML & CSS'}</Title>
            <Row>
              <Chunk>
                <StyledHeading>Day 1</StyledHeading>
                <UnorderedList>
                  <StyledList>Elements</StyledList>
                  <StyledList>Styling</StyledList>
                  <StyledList>Box Model</StyledList>
                  <StyledList>Browser Dev Tools</StyledList>
                </UnorderedList>
              </Chunk>
              <Chunk>
                <StyledHeading>Day 2</StyledHeading>
                <UnorderedList>
                  <StyledList>Flexbox</StyledList>
                  <StyledList>Advanced Selectors</StyledList>
                  <StyledList>Units</StyledList>
                  <StyledList>Responsive Design</StyledList>
                  <StyledList>Accessibility</StyledList>
                  <StyledList>Limitations</StyledList>
                </UnorderedList>
              </Chunk>
            </Row>
          </Section>
          <VerticalSpacer size={40} />
          <Section>
            <Title
              style={{
                backgroundImage: `linear-gradient(45deg, orange, #ffe433)`,
              }}
            >
              {'Day 3-4: TypeScript'}
            </Title>
            <Row>
              <Chunk>
                <StyledHeading>Day 3</StyledHeading>
                <UnorderedList>
                  <StyledList>TypeScript Overview</StyledList>
                  <StyledList>Type Declarations</StyledList>
                  <StyledList>Type Refinement</StyledList>
                  <StyledList>DOM</StyledList>
                </UnorderedList>
              </Chunk>
              <Chunk>
                <StyledHeading>Day 4</StyledHeading>
                <UnorderedList>
                  <StyledList>Tools</StyledList>
                  <StyledList>Imports and Exports</StyledList>
                  <StyledList>Events</StyledList>
                  <StyledList>Equality</StyledList>
                </UnorderedList>
              </Chunk>
            </Row>
          </Section>
        </div>
        <HorizontalSpacer size={40} />
        <Section>
          <Title
            style={{
              backgroundImage: `linear-gradient(45deg, steelblue, skyblue)`,
            }}
          >
            {'Day 5-8: React'}
          </Title>
          <StyledHeading>Day 5 - Fundamentals</StyledHeading>
          <UnorderedList>
            <StyledList>{'JSX, Elements & Components'}</StyledList>
            <StyledList>{'Props & Children'}</StyledList>
            <StyledList>Styling</StyledList>
            <StyledList>Conditional Rendering</StyledList>
            <StyledList>{'Lists & Keys'}</StyledList>
          </UnorderedList>
          <StyledHeading>Day 6 - Hooks</StyledHeading>
          <UnorderedList>
            <StyledList>Hooks</StyledList>
            <StyledList>Rules of hooks</StyledList>
            <StyledList>Built-in hooks</StyledList>
            <StyledList>Custom hooks</StyledList>
          </UnorderedList>
          <StyledHeading>Day 7 - Data</StyledHeading>
          <UnorderedList>
            <StyledList>XHR</StyledList>
            <StyledList>Promises</StyledList>
            <StyledList>Async/Await</StyledList>
            <StyledList>Suspense</StyledList>
            <StyledList>Working with Contexts</StyledList>
          </UnorderedList>
          <StyledHeading>Day 8 - Production-readiness</StyledHeading>
          <UnorderedList>
            <StyledList>Performance</StyledList>
            <StyledList>Devtools</StyledList>
            <StyledList>Lifecycle</StyledList>
            <StyledList>Patterns</StyledList>
            <StyledList>Testing</StyledList>
          </UnorderedList>
        </Section>
      </Inner>
    </Container>
  )
}
