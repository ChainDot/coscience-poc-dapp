import React, { useState } from 'react'
import {
  Container,
  Box,
  Heading,
  Button,
  Text,
  Link,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useWeb3 } from '../web3hook/useWeb3'

const About = () => {
  const { state } = useWeb3()
  const scheme = useColorModeValue('colorMain', 'colorSecond')
  const bg = useColorModeValue('white', 'grayBlue.900')

  const [amount, setAmount] = useState(0)
  const handleChange = (value) => setAmount(value)
  const [status, setStatus] = useState()

  // function sign() {}
  // try to sign a message

  async function donate() {
    try {
      setStatus('Pending')
      const response = await state.signer.sendTransaction({
        from: state.account,
        to: '0x5F6922217C1CFCC7ebC457585c76841b73b179A3',
        value: ethers.utils.parseEther(amount.toString()) // 2441406250
      })
      await response.wait()
      setStatus('Success')
    } catch (e) {
      console.log(e.code)
      if (e.code === 'INSUFFICIENT_FUNDS') {
        setStatus('INSUFFICIENT_FUNDS')
      } else {
        setStatus('Failed')
      }
    }
  }

  return (
    <>
      <Box m='auto'>
        <Container
          shadow='lg'
          maxW='container.md'
          bg={bg}
          p='10'
          borderRadius='20'
        >
          <Heading mb='4' textAlign='center'>
            About CoScience
          </Heading>
          <Link
            isExternal
            href='https://github.com/RaphaelHardFork/coscience-poc-dapp/tree/version-0.1'
            variant='link'
            color='main'
            fontWeight='bold'
            my='4'
          >
            Github
          </Link>
          <Text my='2'>Support CoScience</Text>
          <NumberInput
            maxW='100px'
            mr='2rem'
            value={amount}
            onChange={handleChange}
            step={0.001}
            max={Number(ethers.utils.formatEther(state.balance))}
            min={0}
            mb='2'
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Slider
            flex='1'
            focusThumbOnChange={false}
            value={amount}
            onChange={handleChange}
            step={0.001}
            max={Number(ethers.utils.formatEther(state.balance))}
            min={0}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize='sm' boxSize='20px' children={amount} />
          </Slider>
          <Button
            onClick={donate}
            display='flex'
            mx='auto'
            size='lg'
            colorScheme={scheme}
          >
            Donate
          </Button>
          <Text my='2'>{status ? `Status: ${status}` : ''}</Text>
        </Container>
      </Box>
    </>
  )
}

export default About
