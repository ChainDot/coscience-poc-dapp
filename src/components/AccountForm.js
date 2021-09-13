import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Textarea,
  SlideFade,
  Text
} from '@chakra-ui/react'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUsersContract } from '../hooks/useUsersContract'
import { useIPFS } from '../hooks/useIPFS'
import { useCall } from '../web3hook/useCall'

const AccountForm = () => {
  const { users } = useUsersContract() // [contract]
  const [status, contractCall] = useCall()
  const [pinJsObject, , ipfsStatus] = useIPFS()

  // factorize in a reducer? with initial state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [laboratory, setLaboratory] = useState('')
  const [email, setEmail] = useState('')
  const [registerMail, setRegisterMail] = useState('')
  const [bio, setBio] = useState('')

  //color Mode
  const bg = useColorModeValue('white', 'gray.800')
  const scheme = useColorModeValue('colorMain', 'colorSecond')

  async function register() {
    const nameObj = {
      version: 0.1,
      firstName,
      lastName,
      registerMail
    }
    const nameHash = await pinJsObject(nameObj)
    const userObj = {
      version: 0.1,
      userInfo: nameHash,
      email,
      laboratory,
      bio
    }
    const userHash = await pinJsObject(userObj)
    await contractCall(users, 'register', [userHash, nameHash])
    setBio('')
    setLaboratory('')
    setLastName('')
    setFirstName('')
    setEmail('')
    setRegisterMail('')
  }

  return (
    <>
      <Box borderRadius='50' bg={bg} py='10'>
        <SlideFade
          threshold='0.1'
          delay={{ enter: 0.1 }}
          transition={{
            enter: { duration: 0.7 }
          }}
          offsetY='-100px'
          offsetX='0px'
          in
        >
          <Heading textAlign='center' mb='2'>
            Create an account to publish an article
          </Heading>
          <Box mx='auto' maxW='50%' display='flex' flexDirection='column'>
            <Heading mt='4' fontSize='xl' as='h3'>
              Essential informations
            </Heading>
            <Text mb='4' color='gray'>
              These informations will be stored permanently and can't be
              editable.
            </Text>
            <FormControl mb='4' isRequired>
              <FormLabel>First name</FormLabel>
              <Input
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Alice'
                value={firstName}
              />
            </FormControl>
            <FormControl mb='4' isRequired>
              <FormLabel>Last name</FormLabel>
              <Input
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Bob'
                value={lastName}
              />
            </FormControl>
            <FormControl mb='4' isRequired>
              <FormLabel>Institutional e-mail for registration</FormLabel>
              <Input
                type='email'
                onChange={(e) => setRegisterMail(e.target.value)}
                placeholder='Bob@alice.com'
                value={registerMail}
              />
            </FormControl>
            <Heading mt='4' fontSize='xl' as='h3'>
              About you
            </Heading>
            <Text mb='4' color='gray'>
              Except the laboratory, these informations are not essential to
              register and can be editable in your profile.
            </Text>
            <FormControl mb='4' isRequired>
              <FormLabel>Laboratory</FormLabel>
              <Input
                onChange={(e) => setLaboratory(e.target.value)}
                placeholder='MIT'
                value={laboratory}
              />
            </FormControl>
            <FormControl mb='4'>
              <FormLabel>Your contact e-mail</FormLabel>
              <Input
                type='email'
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Bob@alice.com'
                value={email}
              />
            </FormControl>
            <FormControl mb='4'>
              <FormLabel>Bio</FormLabel>
              <Textarea
                minH='40'
                onChange={(e) => setBio(e.target.value)}
                placeholder='Your experience, ...'
                value={bio}
              />
            </FormControl>
            <Button
              isLoading={
                status.startsWith('Waiting') ||
                status.startsWith('Pending') ||
                ipfsStatus.startsWith('Pinning')
              }
              loadingText={
                ipfsStatus.startsWith('Pinning') ? ipfsStatus : status
              }
              disabled={
                !firstName.length ||
                !lastName.length ||
                !laboratory.length ||
                !registerMail.length ||
                status.startsWith('Waiting') ||
                status.startsWith('Pending') ||
                ipfsStatus.startsWith('Pinning')
              }
              onClick={register}
              colorScheme={scheme}
            >
              Register
            </Button>
          </Box>
        </SlideFade>

        <SlideFade
          threshold='0.1'
          delay={{ enter: 0.1 }}
          transition={{
            enter: { duration: 0.7 }
          }}
          offsetY='100px'
          offsetX='0px'
          in
        >
          <Heading mt='6' textAlign='center' mb='2'>
            Or recover your profile with your password
          </Heading>
          <Box mx='auto' maxW='50%' display='flex' flexDirection='column'>
            <Button mt='6' as={Link} to='/recover' colorScheme='messenger'>
              Recover account
            </Button>
          </Box>
        </SlideFade>
      </Box>
    </>
  )
}

export default AccountForm
