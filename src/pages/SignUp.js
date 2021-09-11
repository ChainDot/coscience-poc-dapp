import {
  Box,
  Container,
  Button,
  Text,
  useColorModeValue,
  Heading
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useUsersContract } from '../hooks/useUsersContract'
import AccountForm from '../components/AccountForm'
import Loading from '../components/Loading'
import { useWeb3 } from '../web3hook/useWeb3'

const SignUp = () => {
  const { state, connectToMetamask } = useWeb3()
  const { userData } = useUsersContract()

  //color Mode
  const bg = useColorModeValue('white', 'gray.800')
  const scheme = useColorModeValue('colorMain', 'colorSecond')

  return (
    <>
      <Box p='10'>
        <Container maxW='container.lg'>
          <Box shadow='lg' borderRadius='50' py='10' bg={bg}>
            {state.isLogged ? (
              userData ? (
                userData.id !== 0 ? (
                  <Box>
                    <Text mb='6' textAlign='center' fontSize='3xl'>
                      Your account is successfully created.
                    </Text>
                    <Button
                      maxW='30ch'
                      display='flex'
                      mx='auto'
                      colorScheme={scheme}
                      as={Link}
                      to={`/profile/${userData.id}`}
                      disabled={userData.id === undefined}
                    >
                      Go to your profile
                    </Button>
                  </Box>
                ) : (
                  <>
                    <AccountForm />
                  </>
                )
              ) : (
                <Loading />
              )
            ) : (
              <>
                <Heading mb='6' textAlign='center'>
                  You must connect your Metamask to sign up
                </Heading>
                <Button
                  colorScheme={scheme}
                  display='flex'
                  mx='auto'
                  onClick={connectToMetamask}
                >
                  Connect your metamask
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default SignUp
