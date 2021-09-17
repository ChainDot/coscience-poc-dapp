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
  CircularProgressLabel,
  CircularProgress,
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
  SlideFade,
  Tag
} from "@chakra-ui/react"
import { useState } from "react"
import {
  EmailIcon,
  ChatIcon,
  InfoIcon,
  LinkIcon,
  SettingsIcon
} from "@chakra-ui/icons"
import { useUsersContract } from "../hooks/useUsersContract"
import UserSetting from "./UserSetting"
import mailgo from "mailgo"
import React, { useEffect } from "react"
import { useCall } from "../web3hook/useCall"
import { useGovernanceContract } from "../hooks/useGovernanceContract"

const DashSide = ({ user }) => {
  const { userData } = useUsersContract()
  const [isOpenSetting, setIsOpenSetting] = useState()
  const { governance } = useGovernanceContract()
  const [status, contractCall] = useCall()

  const [value, setValue] = useState()
  const { hasCopied, onCopy } = useClipboard(value)
  const [isOpen, setIsOpen] = useState()
  const onClose = () => setIsOpen(false)
  const onCloseSetting = () => setIsOpenSetting(false)

  useEffect(() => {
    mailgo()
  }, [])

  //                     colorValue

  const button = useColorModeValue("colorMain", "colorSecond")
  const link = useColorModeValue("main", "second")
  const bg = useColorModeValue("grayOrange.200", "grayBlue.700")

  async function voteForRecover(address) {
    contractCall(governance, "voteToRecover", [user.id, address])
  }

  return (
    <>
      <Box p="10" w={{ base: "full", xl: "25vw" }} bg={bg}>
        <SlideFade
          threshold="0.1"
          delay={{ enter: 0.1 }}
          transition={{
            enter: { duration: 0.7 }
          }}
          offsetY="0px"
          offsetX="-100px"
          in
        >
          <Flex flexDirection="column">
            <Flex justifyContent="space-between" mb="4">
              <Avatar
                me="4"
                size="2xl"
                name="Albert Einstein"
                src="https://upload.wikimedia.org/wikipedia/commons/1/14/Albert_Einstein_1947.jpg"
                alt="avatar"
              />{" "}
              <Flex justifyContent="space-between" flexDirection="column">
                <Badge
                  borderRadius="full"
                  shadow="lg"
                  p="3"
                  bg={
                    user.status === "Pending"
                      ? "orange.500"
                      : user.status === "Approved"
                      ? "green.400"
                      : "red.400"
                  }
                  alt="status of user"
                >
                  {user.status}
                </Badge>

                <Tag
                  shadow="lg"
                  borderRadius="full"
                  colorScheme={button}
                  p="3"
                  fontWeight="bold"
                  alt="ID of user"
                >
                  ID #{user.id}
                </Tag>
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Heading my="4" as="h2">
                {user.firstName} {user.lastName}{" "}
              </Heading>

              <Popover placement="top-start">
                <PopoverTrigger>
                  <IconButton
                    variant="Link"
                    color={link}
                    icon={<InfoIcon />}
                    aria-label="info ipfs icon button"
                  />
                </PopoverTrigger>
                <PopoverContent w="100%" textAlign="start" p="2">
                  <PopoverHeader fontWeight="semibold">
                    IPFS Informations
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Text>
                      Profile:{" "}
                      <Link
                        color={link}
                        isExternal
                        href={`https://ipfs.io/ipfs/${user.profileCID}`}
                        aria-label="ipfs redirection link"
                      >
                        ipfs.io
                      </Link>{" "}
                      (gateway)
                    </Text>
                    <Text>
                      Name:{" "}
                      <Link
                        color={link}
                        isExternal
                        href={`https://ipfs.io/ipfs/${user.nameCID}`}
                        aria-label="ipfs redirection link"
                      >
                        ipfs.io
                      </Link>{" "}
                      (gateway)
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Spacer />
              {Number(user.id) === userData.id ? (
                <IconButton
                  colorScheme={button}
                  aria-label="setting button"
                  size="lg"
                  icon={<SettingsIcon />}
                  onClick={setIsOpenSetting}
                  borderRadius="100"
                />
              ) : (
                ""
              )}
            </Flex>
            {/* SETTINGS MODAL */}
            <Modal size="lg" isOpen={isOpenSetting} onClose={onCloseSetting}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton aria-label="modal close button" />
                <ModalBody pb={6}>
                  <UserSetting user={user} />
                </ModalBody>
              </ModalContent>
            </Modal>

            {/* USER PROFILE */}

            <Flex my="4" alignItems="center">
              <EmailIcon me="4" alt="email icon" />
              <Link
                href={`mailto:${user.email}`}
                aria-label="email redirection"
              >
                {user.email}
                <LinkIcon mx="2px" alt="link icon" />
              </Link>
            </Flex>
            <Text my="2">Laboratory: {user.laboratory}</Text>

            <Text my="4" fontWeight="bold">
              <ChatIcon alt="biography icon" /> Bio:
            </Text>

            <Box borderRadius="5" bg={bg} w="100%" p={4}>
              <Text>{user.bio}</Text>
            </Box>

            <Button
              my="6"
              rounded={"full"}
              px={6}
              colorScheme={button}
              onClick={setIsOpen}
              aria-label="wallet list button"
            >
              Wallet List
            </Button>
            <AlertDialog isOpen={isOpen} onClose={onClose}>
              <AlertDialogOverlay />

              <AlertDialogContent>
                <AlertDialogHeader>Here your Wallet List</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  <UnorderedList listStyleType="none">
                    {user.walletList !== undefined
                      ? user.walletList.map((wallet) => {
                          return (
                            <Flex key={wallet} as="li" mb={2}>
                              <Input
                                onClick={(e) => setValue(e.target.value)}
                                value={wallet}
                                isReadOnly
                                placeholder="test"
                              />
                              <Button
                                disabled={value !== wallet}
                                onClick={onCopy}
                                ml={2}
                                aria-label="copy button"
                              >
                                {hasCopied ? "Copied" : "Copy"}
                              </Button>
                            </Flex>
                          )
                        })
                      : ""}
                  </UnorderedList>
                </AlertDialogBody>
              </AlertDialogContent>
            </AlertDialog>

            {/* VOTE FOR RECOVER ACCOUNT */}
            {user.recoverAddress.length === 0 ? (
              ""
            ) : (
              <Box p="4" borderRadius="6" border="solid" textAlign="center">
                <Heading mb="4">Recover account asked</Heading>
                {user.recoverAddress.map((ask) => {
                  return (
                    <Box key={ask.address}>
                      <Text mb="2">{ask.address}</Text>
                      <Flex
                        mb="4"
                        justifyContent="space-around"
                        alignItems="center"
                      >
                        <Button
                          isLoading={
                            status.startsWith("Waiting") ||
                            status.startsWith("Pending")
                          }
                          loadingText={status}
                          disabled={
                            status.startsWith("Waiting") ||
                            status.startsWith("Pending")
                          }
                          onClick={() => voteForRecover(ask.address)}
                          colorScheme={button}
                          aria-label="click to approve the address for recover account"
                        >
                          Vote to approve this address
                        </Button>
                        <CircularProgress
                          me="4"
                          value={ask.nbOfVote}
                          max="5"
                          color="second"
                          my="auto"
                          ms="5"
                        >
                          <CircularProgressLabel>
                            {ask.nbOfVote}/5
                          </CircularProgressLabel>
                        </CircularProgress>
                      </Flex>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Flex>
        </SlideFade>
      </Box>
    </>
  )
}
export default DashSide
