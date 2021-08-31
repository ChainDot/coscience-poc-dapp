import React from "react"
import { Container, Box, Heading, Button } from "@chakra-ui/react"

const About = () => {
  return (
    <>
      <Box p="10">
        <Container maxW="container.xl">
          <Heading my="10" textAlign="center">
            About CoScience
          </Heading>
          <Button display="flex" mx="auto" size="lg" colorScheme="cyan">
            Donate
          </Button>
        </Container>
      </Box>
    </>
  )
}

export default About
