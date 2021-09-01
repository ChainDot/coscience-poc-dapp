import {
  Button,
  Stack,
  Heading,
  Text,
  Container,
  useColorModeValue,
} from "@chakra-ui/react"

const CallToAction = () => {
  const txt = useColorModeValue("gray.800", "white")

  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign="center"
        align="center"
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          fontFamily="title"
        >
          The{" "}
          <Text as={"span"} color="main.500">
            Collective
          </Text>{" "}
          Science Platform
        </Heading>
        <Text fontFamily="text" color={txt} fontSize="lg" maxW={"3xl"}>
          Science with collective intelligence and community governance
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button rounded={"full"} px={6} colorScheme={"orange"}>
            Get started
          </Button>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default CallToAction
