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

  return (
    <>
      {networkName === 'rinkeby' ||
      networkName === 'kovan' ||
      networkName === 'goerli' ||
      networkName === 'maticmum' ||
      networkName === 'bnbt' ? (
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
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
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
                    Please switch to one of these network
                  </Text>

                  <Flex wrap='wrap'>
                    <Button
                      onClick={() => switchNetwork('0x4', 'rinkeby')}
                      colorScheme='yellow'
                      display='flex'
                      mx='1'
                      my='4'
                      aria-label='switch network to rinkeby'
                    >
                      Switch to Rinkeby
                    </Button>
                    <Button
                      onClick={() => switchNetwork('0x2a', 'kovan')}
                      colorScheme='purple'
                      display='flex'
                      mx='1'
                      my='4'
                      aria-label='switch network to kovan'
                    >
                      Switch to Kovan
                    </Button>
                    <Button
                      onClick={() => switchNetwork('0x5', 'goerli')}
                      colorScheme='blue'
                      display='flex'
                      mx='1'
                      my='4'
                      aria-label='switch network to goerli'
                    >
                      Switch to Goerli
                    </Button>
                    <Button
                      onClick={() => switchNetwork('0x61', 'bnbt')}
                      colorScheme='orange'
                      display='flex'
                      mx='1'
                      my='4'
                      aria-label='switch network to BSC testnet'
                    >
                      Switch to BSC Testnet
                    </Button>
                    <Button
                      onClick={() => switchNetwork('0x13881', 'maticmum')}
                      colorScheme='pink'
                      display='flex'
                      mx='1'
                      my='4'
                      aria-label='switch network to Polygon mumbai'
                    >
                      Switch to Polygon Mumbai
                    </Button>
                  </Flex>
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
