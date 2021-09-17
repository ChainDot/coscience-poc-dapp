import {
  Heading,
  Button,
  Box,
  useColorModeValue,
  Flex,
  Skeleton
} from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"

import { Link, useParams } from "react-router-dom"
import Dashboard from "../components/Dashboard"
import DashSide from "../components/DashSide"
import Loading from "../components/Loading"
import { useGovernanceContract } from "../hooks/useGovernanceContract"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"
import { voteProgression } from "../components/Header"

const Profile = () => {
  const { users, getUserData } = useUsersContract()
  const { governance } = useGovernanceContract()
  const [, readIPFS] = useIPFS()
  const [user, setUser] = useState()

  const { id } = useParams()

  useEffect(() => {
    const userData = async () => {
      // get blockchain info
      const userObj = await getUserData(users, id)

      // check event on this profile
      let recoverFilter = await governance.filters.AskForRecover(
        null,
        Number(id)
      )
      let recoverEvent = await governance.queryFilter(recoverFilter)

      const recoverAddress = await Promise.all(
        recoverEvent.map(async (event) => {
          let nbOfVote = await voteProgression(
            governance,
            "RecoverVoted",
            Number(id),
            event.args.newAddress,
            null
          )
          return { address: event.args.newAddress, nbOfVote: nbOfVote.length }
        })
      )

      // get user info from IPFS
      const { email, laboratory, bio } = await readIPFS(userObj.profileCID)
      const { firstName, lastName } = await readIPFS(userObj.nameCID)
      setUser({
        ...userObj,
        email,
        laboratory,
        bio,
        firstName,
        lastName,
        recoverAddress
      })
    }
    if (users && governance) {
      userData()
      governance.on("AskForRecover", userData)
      governance.on("RecoverVoted", userData)
    }

    return () => {
      setUser()
      governance?.off("AskForRecover", userData)
      governance?.off("RecoverVoted", userData)
    }
  }, [id, getUserData, users, readIPFS, governance])

  const bg = useColorModeValue("white", "gray.800")

  return (
    <>
      <Flex flexDirection={{ base: "column", xl: "row" }} flex="1">
        {user ? (
          <DashSide user={user} />
        ) : (
          <Skeleton
            w={{ base: "25vw", lg: "0" }}
            h={{ base: "0", lg: "150px" }}
          />
        )}

        <Box flex="1" shadow="lg" px="6" py="10" bg={bg}>
          {user ? (
            user.id === 0 ? (
              <>
                <Heading textAlign="center" mb="6">
                  You don't have an account yet
                </Heading>
                <Button
                  maxW="10%"
                  display="flex"
                  mx="auto"
                  size="lg"
                  as={Link}
                  to="/sign-up"
                  aria-label="Sign up button"
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Dashboard user={user} />
              </>
            )
          ) : (
            <Loading />
          )}
        </Box>
      </Flex>
    </>
  )
}

export default Profile
