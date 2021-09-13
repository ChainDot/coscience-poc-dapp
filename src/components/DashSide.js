import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Popover,
  Spacer,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useClipboard,
  Badge,
  useColorModeValue,
  SlideFade
} from '@chakra-ui/react'
import { useState } from 'react'
import {
  EmailIcon,
  ChatIcon,
  InfoIcon,
  LinkIcon,
  SettingsIcon
} from '@chakra-ui/icons'
import { useUsersContract } from '../hooks/useUsersContract'
import UserSetting from './UserSetting'
import mailgo from 'mailgo'
import React, { useEffect } from 'react'

const DashSide = ({ user }) => {
  const { userData } = useUsersContract()
  const [isOpenSetting, setIsOpenSetting] = useState()

  const [value, setValue] = useState()
  const { hasCopied, onCopy } = useClipboard(value)
  const [isOpen, setIsOpen] = useState()
  const onClose = () => setIsOpen(false)
  const onCloseSetting = () => setIsOpenSetting(false)

  useEffect(() => {
    mailgo()
  }, [])

  //                     colorValue

  const button = useColorModeValue('colorMain', 'colorSecond')
  const link = useColorModeValue('main', 'second')
  const bg = useColorModeValue('grayOrange.200', 'grayBlue.700')

  return (
    <>
      <Box p='10' w={{ base: 'full', lg: '25vw' }} bg={bg}>
        <SlideFade
          threshold='0.1'
          delay={{ enter: 0.1 }}
          transition={{
            enter: { duration: 0.7 }
          }}
          offsetY='0px'
          offsetX='-100px'
          in
        >
          <Flex flexDirection='column'>
            <Flex justifyContent='space-between' mb='4'>
              <Avatar
                me='4'
                size='2xl'
                name='Segun Adebayo'
                src='https://bit.ly/sage-adebayo'
              />{' '}
              <Flex justifyContent='space-between' flexDirection='column'>
                <Badge
                  borderRadius='5'
                  shadow='lg'
                  p='2'
                  bg={
                    user.status === 'Pending'
                      ? 'orange.500'
                      : user.status === 'Approved'
                      ? 'green.400'
                      : 'red.400'
                  }
                >
                  {user.status}
                </Badge>

                <Badge
                  shadow='lg'
                  p='2'
                  borderRadius='5'
                  color='black'
                  colorScheme='colorSecond'
                >
                  ID {user.id}
                </Badge>
              </Flex>
            </Flex>
            <Flex alignItems='center' justifyContent='space-between'>
              <Heading my='4' as='h2'>
                {user.firstName} {user.lastName}{' '}
              </Heading>

              <Popover placement='top-start'>
                <PopoverTrigger>
                  <IconButton variant='Link' color={link} icon={<InfoIcon />} />
                </PopoverTrigger>
                <PopoverContent w='100%' textAlign='start' p='2'>
                  <PopoverHeader fontWeight='semibold'>
                    IPFS Informations
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Text>
                      Profile:{' '}
                      <Link
                        color={link}
                        isExternal
                        href={`https://ipfs.io/ipfs/${user.profileCID}`}
                      >
                        ipfs.io
                      </Link>{' '}
                      (gateway)
                    </Text>
                    <Text>
                      Name:{' '}
                      <Link
                        color={link}
                        isExternal
                        href={`https://ipfs.io/ipfs/${user.nameCID}`}
                      >
                        ipfs.io
                      </Link>{' '}
                      (gateway)
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Spacer />
              {Number(user.id) === userData.id ? (
                <IconButton
                  colorScheme={button}
                  aria-label='Call Segun'
                  size='lg'
                  icon={<SettingsIcon />}
                  onClick={setIsOpenSetting}
                  borderRadius='100'
                />
              ) : (
                ''
              )}
            </Flex>
            {/* SETTINGS MODAL */}
            <Modal size='lg' isOpen={isOpenSetting} onClose={onCloseSetting}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <UserSetting user={user} />
                </ModalBody>
              </ModalContent>
            </Modal>

            {/* USER PROFILE */}

            <Flex my='4' alignItems='center'>
              <EmailIcon me='4' />
              <Link href={`mailto:${user.email}`}>
                {user.email}
                <LinkIcon mx='2px' />
              </Link>
            </Flex>
            <Text my='2'>Laboratory: {user.laboratory}</Text>

            <Text my='4' fontWeight='bold'>
              <ChatIcon /> Bio:
            </Text>

            <Box borderRadius='5' bg={bg} w='100%' p={4}>
              <Text>{user.bio}</Text>
            </Box>

            <Button
              my='6'
              rounded={'full'}
              px={6}
              colorScheme={button}
              onClick={setIsOpen}
            >
              Wallet List
            </Button>
            <AlertDialog isOpen={isOpen} onClose={onClose}>
              <AlertDialogOverlay />

              <AlertDialogContent>
                <AlertDialogHeader>Here your Wallet List</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  <UnorderedList listStyleType='none'>
                    {user.walletList !== undefined
                      ? user.walletList.map((wallet) => {
                          return (
                            <Flex key={wallet} as='li' mb={2}>
                              <Input
                                onClick={(e) => setValue(e.target.value)}
                                value={wallet}
                                isReadOnly
                                placeholder='test'
                              />
                              <Button
                                disabled={value !== wallet}
                                onClick={onCopy}
                                ml={2}
                              >
                                {hasCopied ? 'Copied' : 'Copy'}
                              </Button>
                            </Flex>
                          )
                        })
                      : ''}
                  </UnorderedList>
                </AlertDialogBody>
              </AlertDialogContent>
            </AlertDialog>
          </Flex>
        </SlideFade>
      </Box>
    </>
  )
}
export default DashSide
