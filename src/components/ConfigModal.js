import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useWeb3 } from '../web3hook/useWeb3'

const ConfigModal = () => {
  const { state, switchNetwork } = useWeb3()
  const { networkName } = state

  const back = useColorModeValue('white', 'black')

  // switch network: will goes soon in a hook
  /*
  const switchNetwork = async () => {
    try {
      await state.ethersProvider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x4" }],
      })
    } catch (e) {
      console.log(e)
    }
  }
  */

  return (
    <>
      {networkName === 'rinkeby' ? (
        ''
      ) : (
        <>
          <Box
            top='0'
            position='fixed'
            zIndex='400'
            minH='100vh'
            minW='100vw'
            bg={back}
            opacity='0.8'
          ></Box>
          <Flex
            top='0'
            minW='100vw'
            position='fixed'
            zIndex='401'
            height='50%'
            minH='100vh'
            opacity='1'
          >
            <Box
              p='10'
              borderRadius='30'
              m='auto'
              height={{ base: '80%', lg: '50%' }}
              width={{ base: '80%', lg: '50%' }}
              bgGradient={`linear(to-br,${back},main)`}
              shadow='dark-lg'
              display='flex'
            >
              <Flex m='auto' flexDirection='column'>
                <Heading my='4' textAlign='center'>
                  Welcome to CoScience!
                </Heading>
                <Text fontSize='lg'>
                  You are connected to the blockchain through the Metamask
                  provider
                </Text>

                <>
                  <Text
                    textAlign='center'
                    fontWeight='bold'
                    opacity='1'
                    fontSize='4xl'
                    my='4'
                  >
                    Please switch to Rinkeby network
                  </Text>
                  <Button
                    onClick={() => switchNetwork('0x4', 'rinkeby')}
                    colorScheme='yellow'
                    display='flex'
                    mx='auto'
                    my='4'
                  >
                    Switch to Rinkeby
                  </Button>
                </>
              </Flex>
            </Box>
          </Flex>
        </>
      )}
    </>
  )
}

export default ConfigModal
