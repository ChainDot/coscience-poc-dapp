import {
  Box,
  Heading,
  Container,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Button,
  RadioGroup,
  Radio,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useState } from "react"
import { useMetamask } from "../hooks/useMetamask"
import { useUsersContract } from "../hooks/useUsersContract"

const RecoverAccount = () => {
  const bg = useColorModeValue("white", "gray.800")
  const [users, , userList] = useUsersContract()
  const [status, contractCall] = useMetamask()

  const [password, setPassword] = useState("")
  const [userID, setUserID] = useState()

  async function forgotWallet() {
    await contractCall(users, "forgotWallet", [
      ethers.utils.id(password),
      userID,
    ])
    setPassword("")
  }

  return (
    <>
      <Box p="10">
        <Container fontSize="3xl" maxW="container.lg">
          <Box shadow="lg" borderRadius="50" px="6" py="10" bg={bg}>
            <Heading textAlign="center">Recover your account </Heading>
            <Box mx="auto" maxW="75%" display="flex" flexDirection="column">
              <RadioGroup
                value={userID}
                display="flex"
                flexDirection="column"
                mb="4"
              >
                <FormLabel>Profile to recover</FormLabel>
                {userList.map((user) => {
                  return (
                    <Radio
                      onClick={() => setUserID(user.id)}
                      value={user.id}
                      key={user.id}
                      my="4"
                    >
                      {user.firstName} {user.lastName}{" "}
                    </Radio>
                  )
                })}
              </RadioGroup>
              <FormControl mb="4">
                <FormLabel>Password</FormLabel>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="************"
                />
              </FormControl>
              <Button
                isLoading={
                  status.startsWith("Waiting") || status.startsWith("Pending")
                }
                loadingText={status}
                disabled={
                  !password.length ||
                  status.startsWith("Waiting") ||
                  status.startsWith("Pending")
                }
                onClick={forgotWallet}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default RecoverAccount
