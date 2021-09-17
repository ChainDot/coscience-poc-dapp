import React from 'react'
import {
  Box,
  Container,
  Image,
  Heading,
  Button,
  useColorModeValue
} from '@chakra-ui/react'

import { Link } from 'react-router-dom'

const Page404 = () => {
  // colorValue
  const scheme = useColorModeValue('colorMain', 'colorSecond')
  const bg = useColorModeValue('white', 'grayBlue.900')
  const bgTitle = useColorModeValue('grayOrange.100', 'grayBlue.800')
  return (
    <>
      <Box p='10' m='auto'>
        <Container
          d='flex'
          flexDirection='column'
          alignItems='center'
          maxW='container.2xl'
          p='10'
          bg={bg}
          borderRadius='20'
        >
          <Heading bg={bgTitle} p='5' borderRadius='10'>
            PAGE NOT FOUND
          </Heading>
          <Image
            mx='auto'
            w='350px'
            h='350px'
            animation='rotation 2s'
            transform='rotate(360deg)'
            src='https://ipfs.io/ipfs/QmXRXx7tgHgFoaceDZZfpcoKMMkwWcsmLr5MSveGgiFEZx'
          />

          <Button
            as={Link}
            to='/'
            colorScheme={scheme}
            aria-label='Home page redirection button'
          >
            GO TO HOME PAGE
          </Button>
        </Container>
      </Box>
    </>
  )
}

export default Page404
