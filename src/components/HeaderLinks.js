import {
  Box,
  Button,
  Flex,
  LinkBox,
  LinkOverlay,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const HeaderLinks = ({ user, isOpen, onClose }) => {
  const hover = useColorModeValue('mainLight', 'secondDark')
  const pill = useColorModeValue('main', 'second')
  const scheme = useColorModeValue('colorMain', 'colorSecond')
  const bg = useColorModeValue('grayOrange.100', 'grayBlue.800')

  return (
    <Flex
      key={user.id}
      alignItems='center'
      flexDirection={isOpen ? 'column' : ''}
      w={isOpen ? 'full' : ''}
    >
      <Button
        w={isOpen ? 'full' : ''}
        onClick={onClose}
        as={Link}
        to='/'
        variant='ghost'
        mx='1'
        aria-label='Home page redirection'
      >
        Home
      </Button>

      <Button
        w={isOpen ? 'full' : ''}
        onClick={onClose}
        as={Link}
        to='/list-of-users'
        variant='ghost'
        mx='1'
        aria-label='Users list page redirection'
      >
        List of users
      </Button>
      <Button
        w={isOpen ? 'full' : ''}
        onClick={onClose}
        variant='ghost'
        as={Link}
        to='/upload-article'
        mx='1'
        aria-label='Upload article page redirection'
      >
        Upload Article
      </Button>
      <Button
        w={isOpen ? 'full' : ''}
        onClick={onClose}
        variant='ghost'
        as={Link}
        to='/about'
        mx='1'
        aria-label='About page redirection'
      >
        About
      </Button>
      {user.id === undefined ? (
        'Loading'
      ) : user.id === 0 ? (
        <Button
          onClick={onClose}
          as={Link}
          to='/sign-up'
          colorScheme={scheme}
          size='sm'
          mx='1'
          aria-label='Sign up page redirection'
        >
          Sign up
        </Button>
      ) : (
        <>
          <LinkBox
            display='flex'
            transition='0.3s'
            borderRadius='10'
            _hover={{ backgroundColor: hover }}
            p='2'
            alignItems='center'
            bg={bg}
            mx='1'
          >
            <Box
              me='4'
              bgGradient={`linear(to-br,${pill},grayBlue.500)`}
              width='25px'
              height='25px'
              borderRadius='100'
            ></Box>
            <LinkOverlay
              as={Link}
              to={`/profile/${user.id}`}
              aria-label='Profile Dashboard page redirection '
            />
            <Text fontWeight='bold'>
              {user.firstName} {user.lastName}
            </Text>
          </LinkBox>
        </>
      )}
    </Flex>
  )
}

export default HeaderLinks
