import { Button } from "@chakra-ui/button"
import { useColorModeValue } from "@chakra-ui/color-mode"
import { Flex, LinkBox, LinkOverlay, Spacer, Text } from "@chakra-ui/layout"
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress"
import { Tag } from "@chakra-ui/tag"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useGovernanceContract } from "../hooks/useGovernanceContract"
import { useUsersContract } from "../hooks/useUsersContract"
import { useCall } from "../web3hook/useCall"

const User = ({ user }) => {
  const { users, owner, isOwner } = useUsersContract()
  const { governance } = useGovernanceContract()
  const [status, contractCall] = useCall()

  const [vote, setVote] = useState({ accept: 0, ban: 0 })

  //                  Color Value
  const bgUser = useColorModeValue("grayOrange.100", "grayBlue.800")
  const txt = useColorModeValue("mainLight", "second")
  const scheme = useColorModeValue("colorMain", "colorSecond")

  useEffect(() => {
    // get events on this user
    const updateVote = async () => {
      let nbOfAcceptVote = await governance.filters.UserVoted(0, user.id, null)
      let nbOfBanVote = await governance.filters.UserVoted(1, user.id, null)

      nbOfAcceptVote = await governance.queryFilter(nbOfAcceptVote)
      nbOfBanVote = await governance.queryFilter(nbOfBanVote)
      setVote({ accept: nbOfAcceptVote.length, ban: nbOfBanVote.length })
    }
    updateVote()
    governance?.on("UserVoted", updateVote)

    return () => governance?.off("UserVoted", updateVote)
  }, [governance, user.id])

  // contract users
  async function acceptUser(id) {
    await contractCall(users, "acceptUser", [id])
  }

  async function banUser(id) {
    await contractCall(users, "banUser", [id])
  }

  // contract governance

  async function voteToAcceptUser(id) {
    await contractCall(governance, "voteToAcceptUser", [id])
  }

  async function voteToBanUser(id) {
    await contractCall(governance, "voteToBanUser", [id])
  }

  return (
    <Flex
      borderRadius="10"
      shadow="lg"
      p="4"
      mb="5"
      as={LinkBox}
      alignItems={{ base: "space-around", lg: "center" }}
      justifyContent={"space-around"}
      _hover={{ backgroundColor: txt }}
      transition="0.3s"
      bg={bgUser}
      direction={{ base: "column", lg: "row" }}
    >
      <Text w="7%" fontSize="3xl">
        #{user.id}
      </Text>
      <Flex w="25%" flexDirection="column">
        <Text fontWeight="bold">
          {user.firstName} {user.lastName}
        </Text>
        <Text wrap="wrap"> {user.walletList[0].slice(0, 10)}... </Text>
      </Flex>
      <Text w="15%"> {user.nbOfWallet} Wallet(s) </Text>
      <LinkOverlay as={Link} to={`/profile/${user.id}`}></LinkOverlay>

      <Flex alignItems="center" direction="column" width="75px">
        {user.status === "Pending"
          ? "Pending"
          : user.status === "Approved"
          ? "Approved"
          : "Banned"}
        <Tag
          borderRadius="full"
          variant="solid"
          bg={
            user.status === "Pending"
              ? "orange.500"
              : user.status === "Approved"
              ? "green.400"
              : "red.400"
          }
        ></Tag>
      </Flex>
      <Spacer />

      {/* OWNER OPTIONS */}

      {owner !== governance?.address ? (
        isOwner ? (
          <Button
            onClick={() => banUser(user.id)}
            isLoading={
              status.startsWith("Waiting") || status.startsWith("Pending")
            }
            loadingText={status}
            disabled={
              user.status === "Not approved" ||
              status.startsWith("Waiting") ||
              status.startsWith("Pending")
            }
            colorScheme={txt}
          >
            Ban
          </Button>
        ) : (
          <Button
            onClick={() => acceptUser(user.id)}
            isLoading={
              status.startsWith("Waiting") || status.startsWith("Pending")
            }
            loadingText={status}
            disabled={
              user.status === "Not approved" ||
              status.startsWith("Waiting") ||
              status.startsWith("Pending")
            }
            colorScheme={txt}
          >
            Accept
          </Button>
        )
      ) : user.status === "Approved" ? (
        <Flex alignItems="center" flexDirection="row">
          {vote.ban ? (
            <CircularProgress me="4" value={vote.ban} max="5" color="red">
              <CircularProgressLabel>{vote.ban}/5</CircularProgressLabel>
            </CircularProgress>
          ) : (
            ""
          )}
          <Button
            colorScheme={scheme}
            onClick={() => voteToBanUser(user.id)}
            isLoading={
              status.startsWith("Waiting") || status.startsWith("Pending")
            }
            loadingText={status}
            disabled={
              user.status === "Not approved" ||
              status.startsWith("Waiting") ||
              status.startsWith("Pending")
            }
          >
            Vote for ban
          </Button>
        </Flex>
      ) : (
        <>
          <Flex alignItems="center" flexDirection="row">
            {vote.accept ? (
              <CircularProgress
                me="4"
                value={vote.accept}
                max="5"
                color="green.400"
              >
                <CircularProgressLabel>{vote.accept}/5</CircularProgressLabel>
              </CircularProgress>
            ) : (
              ""
            )}
            <Button
              colorScheme={scheme}
              onClick={() => voteToAcceptUser(user.id)}
              isLoading={
                status.startsWith("Waiting") || status.startsWith("Pending")
              }
              loadingText={status}
              disabled={
                user.status === "Not approved" ||
                status.startsWith("Waiting") ||
                status.startsWith("Pending")
              }
            >
              Vote for accept
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default User
