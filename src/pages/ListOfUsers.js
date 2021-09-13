import {
  Box,
  Text,
  Heading,
  Container,
  UnorderedList,
  Button,
  SlideFade,
  Tag,
  Progress
} from "@chakra-ui/react"

import { useUsersContract } from "../hooks/useUsersContract"
import { useGovernanceContract } from "../hooks/useGovernanceContract"
import { useColorModeValue } from "@chakra-ui/react"
import Loading from "../components/Loading"

import User from "../components/User"

const ListOfUsers = () => {
  const { userList, owner } = useUsersContract()
  const { governance } = useGovernanceContract()

  //                  Color Value
  const bg = useColorModeValue("white", "grayBlue.900")

  return (
    <>
      <Box p="10">
        <Container maxW="container.lg">
          <Box shadow="lg" borderRadius="50" py="10" bg={bg}>
            <SlideFade
              threshold="0.1"
              delay={{ enter: 0.1 }}
              transition={{
                enter: { duration: 0.7 }
              }}
              offsetY="-100px"
              offsetX="0px"
              in
            >
              <Heading textAlign="center" mb="5">
                List of users
              </Heading>
            </SlideFade>
            <Box mx="auto" maxW="75%" display="flex" flexDirection="column">
              <UnorderedList listStyleType="none">
                {userList.length === 0 ? (
                  <Loading />
                ) : (
                  userList.map((user) => {
                    return (
                      <SlideFade
                        threshold="0.1"
                        delay={{ enter: 0.1 }}
                        transition={{
                          enter: { duration: 0.7 }
                        }}
                        offsetY="0px"
                        offsetX="100px"
                        in
                        key={user.id}
                      >
                        <User user={user} />
                      </SlideFade>
                    )
                  })
                )}
              </UnorderedList>
            </Box>
            <SlideFade
              threshold="0.1"
              delay={{ enter: 0.1 }}
              transition={{
                enter: { duration: 0.7 }
              }}
              offsetY="100px"
              offsetX="0px"
              in
            >
              <Heading textAlign="center">Owner of the contract</Heading>
              {owner !== governance?.address ? (
                <Text textAlign="center">Address: {owner} </Text>
              ) : (
                <Text textAlign="center">Governance contract: {owner}</Text>
              )}
            </SlideFade>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default ListOfUsers
