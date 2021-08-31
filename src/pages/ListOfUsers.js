import {
  Box,
  Flex,
  Text,
  Heading,
  Container,
  LinkBox,
  LinkOverlay,
  UnorderedList,
  Button,
  SlideFade,
} from "@chakra-ui/react"
import { useState } from "react"
import { useContext } from "react"
import { useEffect } from "react"
import { Web3Context } from "web3-hooks"
import { useUsersContract } from "../hooks/useUsersContract"
import { useColorModeValue } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useMetamask } from "../hooks/useMetamask"

const ListOfUsers = () => {
  const [web3State] = useContext(Web3Context)
  const [users, , userList] = useUsersContract()
  const [status, contractCall] = useMetamask()

  const [owner, setOwner] = useState("")
  const [isOwner, setIsOwner] = useState(false)

  // Color Mode
  console.log(userList)
  const bg = useColorModeValue("white", "gray.800")

  useEffect(() => {
    const getOwner = async () => {
      try {
        const owner = await users.owner()
        if (owner.toLowerCase() === web3State.account.toLowerCase()) {
          setIsOwner(true)
        }
        setOwner(owner)
      } catch (e) {
        console.log(e)
      }
    }
    getOwner()
  }, [users, web3State.account])

  async function acceptUser(id) {
    await contractCall(users, "acceptUser", [id])
  }

  async function banUser(id) {
    await contractCall(users, "banUser", [id])
  }

  return (
    <>
      <Box p="10">
        <Container maxW="container.lg">
          <Box shadow="lg" borderRadius="50" py="10" bg={bg}>
            <Heading textAlign="center" mb="2">
              List of users
            </Heading>
            <Box mx="auto" maxW="75%" display="flex" flexDirection="column">
              <UnorderedList listStyleType="none">
                {userList.map((user) => {
                  return (
                    <SlideFade offsetY="0px" offsetX="50px" in>
                      <Flex
                        key={user.id}
                        bg={
                          user.status === "Pending"
                            ? "orange.100"
                            : user.status === "Approved"
                            ? "green.100"
                            : "red.100"
                        }
                        borderRadius="20"
                        shadow="lg"
                        p="4"
                        mb="6"
                        as={LinkBox}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        _hover={{ bg: "purple.100" }}
                        transition="0.3s"
                      >
                        <Text fontSize="3xl">{user.id}</Text>
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text> {user.walletList[0]} </Text>
                        </Flex>
                        <Text> {user.nbOfWallet} Wallet(s) </Text>
                        <LinkOverlay
                          as={Link}
                          to={`/profile/${user.id}`}
                        ></LinkOverlay>

                        {/* OWNER OPTIONS */}
                        {isOwner ? (
                          user.status === "Approved" ? (
                            <Button
                              onClick={() => banUser(user.id)}
                              isLoading={
                                status.startsWith("Waiting") ||
                                status.startsWith("Pending")
                              }
                              loadingText={status}
                              disabled={
                                user.status === "Not approved" ||
                                status.startsWith("Waiting") ||
                                status.startsWith("Pending")
                              }
                            >
                              Ban
                            </Button>
                          ) : (
                            <Button
                              onClick={() => acceptUser(user.id)}
                              isLoading={
                                status.startsWith("Waiting") ||
                                status.startsWith("Pending")
                              }
                              loadingText={status}
                              disabled={
                                user.status === "Not approved" ||
                                status.startsWith("Waiting") ||
                                status.startsWith("Pending")
                              }
                            >
                              Accept
                            </Button>
                          )
                        ) : (
                          ""
                        )}
                      </Flex>
                    </SlideFade>
                  )
                })}
              </UnorderedList>
            </Box>
            <Heading textAlign="center">Owner of the contract</Heading>
            <Text textAlign="center">Address: {owner} </Text>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default ListOfUsers
