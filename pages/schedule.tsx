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
  padding: '100px 40px',
  background: `linear-gradient(135deg, #607d8b, #251542)`,
})

const Inner = styled.div({
  flex: '1 1 0',
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  flexDirection: 'column',
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
  padding: '30px 40px',
  background: 'white',
  borderRadius: '4px',
  // border: `1px solid ${theme.colors.textDecorativeLight}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.1)',
  // width: '33%',
}))

const StyledUnorderedList = styled(UnorderedList)({
  paddingLeft: '30px',
})

const StyledHeading = styled(Heading3)({
  marginBottom: '6px',
  marginTop: '16px',
  background: 'rgba(0,0,0,0.05)',
  display: 'inline-block',
  padding: '0 10px',
  borderRadius: '2px',
})

const ListItem = styled(List)({
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
            flexDirection: 'row',
          }}
        >
          <Section>
            <Title>{'Day 1-2: HTML & CSS'}</Title>
            <Row>
              <Chunk>
                <StyledHeading>Day 1</StyledHeading>
                <StyledUnorderedList>
                  <ListItem>Elements</ListItem>
                  <ListItem>Styling</ListItem>
                  <ListItem>Box Model</ListItem>
                  <ListItem>Browser Dev Tools</ListItem>
                </StyledUnorderedList>
              </Chunk>
              <Chunk>
                <StyledHeading>Day 2</StyledHeading>
                <StyledUnorderedList>
                  <ListItem>Flexbox</ListItem>
                  <ListItem>Advanced Selectors</ListItem>
                  <ListItem>Units</ListItem>
                  <ListItem>Responsive Design</ListItem>
                  <ListItem>Accessibility</ListItem>
                  <ListItem>Limitations</ListItem>
                </StyledUnorderedList>
              </Chunk>
            </Row>
          </Section>
          <HorizontalSpacer size={40} />
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
                <StyledUnorderedList>
                  <ListItem>TypeScript Overview</ListItem>
                  <ListItem>Type Declarations</ListItem>
                  <ListItem>Type Refinement</ListItem>
                  <ListItem>DOM</ListItem>
                </StyledUnorderedList>
              </Chunk>
              <Chunk>
                <StyledHeading>Day 4</StyledHeading>
                <StyledUnorderedList>
                  <ListItem>Tools</ListItem>
                  <ListItem>Imports and Exports</ListItem>
                  <ListItem>Events</ListItem>
                  <ListItem>Equality</ListItem>
                </StyledUnorderedList>
              </Chunk>
            </Row>
          </Section>
        </div>
        <VerticalSpacer size={40} />
        <Section>
          <Title
            style={{
              backgroundImage: `linear-gradient(45deg, steelblue, skyblue)`,
            }}
          >
            {'Day 5-8: React'}
          </Title>
          <Row>
            <Chunk>
              <StyledHeading>Day 5 - Fundamentals</StyledHeading>
              <StyledUnorderedList>
                <ListItem>{'JSX, Elements & Components'}</ListItem>
                <ListItem>{'Props & Children'}</ListItem>
                <ListItem>Styling</ListItem>
                <ListItem>Conditional Rendering</ListItem>
                <ListItem>{'Lists & Keys'}</ListItem>
              </StyledUnorderedList>
            </Chunk>
            <Chunk>
              <StyledHeading>Day 6 - Hooks</StyledHeading>
              <StyledUnorderedList>
                <ListItem>Hooks</ListItem>
                <ListItem>Rules of hooks</ListItem>
                <ListItem>Built-in hooks</ListItem>
                <ListItem>Custom hooks</ListItem>
              </StyledUnorderedList>
            </Chunk>
            <Chunk>
              <StyledHeading>Day 7 - Data</StyledHeading>
              <StyledUnorderedList>
                <ListItem>XHR</ListItem>
                <ListItem>Promises</ListItem>
                <ListItem>Async/Await</ListItem>
                <ListItem>Suspense</ListItem>
                <ListItem>Working with Contexts</ListItem>
              </StyledUnorderedList>
            </Chunk>
            <Chunk>
              <StyledHeading>Day 8 - Production-readiness</StyledHeading>
              <StyledUnorderedList>
                <ListItem>Performance</ListItem>
                <ListItem>Devtools</ListItem>
                <ListItem>Lifecycle</ListItem>
                <ListItem>Patterns</ListItem>
                <ListItem>Testing</ListItem>
              </StyledUnorderedList>
            </Chunk>
          </Row>
        </Section>
      </Inner>
    </Container>
  )
}
