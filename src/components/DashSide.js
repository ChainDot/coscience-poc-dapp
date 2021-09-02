import { SettingsIcon } from "@chakra-ui/icons"
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
} from "@chakra-ui/react"
import { useState } from "react"
import { EmailIcon, ChatIcon } from "@chakra-ui/icons"
import { useUsersContract } from "../hooks/useUsersContract"
import UserSetting from "./UserSetting"

const DashSide = ({ user }) => {
  const [, connectedUser] = useUsersContract()
  const [isOpenSetting, setIsOpenSetting] = useState()

  const [value, setValue] = useState()
  const { hasCopied, onCopy } = useClipboard(value)
  const [isOpen, setIsOpen] = useState()
  const onClose = () => setIsOpen(false)
  const onCloseSetting = () => setIsOpenSetting(false)
  return (
    <>
      <Box p="4" w={{ base: "full", lg: "25vw" }} bg="gray">
        <Flex flexDirection="column">
          <Flex mb="4" justifyContent="space-between">
            <Avatar
              me="4"
              size="2xl"
              name="Segun Adebayo"
              src="https://bit.ly/sage-adebayo"
            />{" "}
            <Flex justifyContent="space-between" flexDirection="column">
              <Box shadow="lg" mb="4" p="2" borderRadius="10" bg="secondLight">
                <Text>ID: {user.id} </Text>
              </Box>
              <Box
                shadow="lg"
                p="2"
                borderRadius="10"
                bg={
                  user.status === "Pending"
                    ? "orange.200"
                    : user.status === "Approved"
                    ? "teal"
                    : "red"
                }
              >
                <Text>Status: {user.status} </Text>
              </Box>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading my="4" as="h2">
              {user.firstName} {user.lastName}{" "}
              <Link
                isTruncated
                isExternal
                href={`https://ipfs.io/ipfs/${user.profileCID}`}
                color="teal"
                fontWeight="bold"
              >
                (See on IPFS)
              </Link>
            </Heading>
            {Number(user.id) === connectedUser.id ? (
              <IconButton
                colorScheme="teal"
                aria-label="Call Segun"
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
              <ModalCloseButton />
              <ModalBody pb={6}>
                <UserSetting user={user} />
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* USER PROFILE */}

          <Text>
            <EmailIcon /> {user.email}
          </Text>
          <Text>Laboratory: {user.laboratory}</Text>

          <Text fontWeight="bold">
            <ChatIcon /> Bio:
          </Text>

          <Box bg="tomato" w="100%" p={4} border="1px">
            <Text>{user.bio}</Text>
          </Box>

          <Button
            my="6"
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"orange.400"}
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
        </Flex>
      </Box>
    </>
  )
}
export default DashSide
