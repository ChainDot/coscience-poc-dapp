import {
  Box,
  Heading,
  Container,
  useColorModeValue,
  FormLabel,
  Text,
  Button,
  RadioGroup,
  Radio
} from '@chakra-ui/react'
import { useState } from 'react'
import { useGovernanceContract } from '../hooks/useGovernanceContract'
import { useUsersContract } from '../hooks/useUsersContract'
import { useCall } from '../web3hook/useCall'

const RecoverAccount = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const { userList } = useUsersContract()
  const { governance } = useGovernanceContract()
  const [status, contractCall] = useCall()

  const [userID, setUserID] = useState(0)

  async function forgotWallet() {
    await contractCall(governance, 'askToRecoverAccount', [userID])
  }

  return (
    <>
      <Box p='10'>
        <Container fontSize='3xl' maxW='container.lg'>
          <Box shadow='lg' borderRadius='50' px='6' py='10' bg={bg}>
            <Heading textAlign='center'>Recover your account </Heading>
            <Box mx='auto' maxW='75%' display='flex' flexDirection='column'>
              <RadioGroup
                value={userID}
                display='flex'
                flexDirection='column'
                mb='4'
              >
                <FormLabel htmlFor='choice'>Profile to recover</FormLabel>
                {userList.map((user) => {
                  return (
                    <Radio
                      id='choice'
                      onClick={() => setUserID(user.id)}
                      value={user.id}
                      key={user.id}
                      my='4'
                    >
                      {user.id}. {user.firstName} {user.lastName}{' '}
                    </Radio>
                  )
                })}
              </RadioGroup>
              <Text>You will ask to recover the account n°{userID}</Text>
              <Button
                colorScheme='colorMain'
                isLoading={
                  status.startsWith('Waiting') || status.startsWith('Pending')
                }
                loadingText={status}
                disabled={
                  status.startsWith('Waiting') ||
                  status.startsWith('Pending') ||
                  userID === 0
                }
                onClick={forgotWallet}
                aria-label='submit button'
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
