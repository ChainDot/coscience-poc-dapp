import React, { useState, useEffect } from "react"
import {
  Box,
  Badge,
  Flex,
  useColorModeValue,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  CloseButton,
  Heading,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Link
} from "@chakra-ui/react"
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons"

import { useColorMode } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { useUsersContract } from "../hooks/useUsersContract"
import HeaderLinks from "./HeaderLinks"
import Notifs from "./Notifs"
import { useGovernanceContract } from "../hooks/useGovernanceContract"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useReviewsContract } from "../hooks/useReviewsContract"

// Pure functions
const itemType = (address, articles, reviews) => {
  if (address === articles.address) {
    return "Ban an article"
  } else if (address === reviews.address) {
    return "Ban a review"
  } else {
    return "Ban a comment"
  }
}

const voteProgression = async (
  contract,
  eventName,
  indexed1,
  indexed2,
  indexed3
) => {
  let nbOfVote = await contract.filters[eventName](indexed1, indexed2, indexed3)
  nbOfVote = await contract.queryFilter(nbOfVote)
  return nbOfVote
}

// Component
const Header = () => {
  const { userData, userList } = useUsersContract()
  const { governance } = useGovernanceContract()
  const { articles } = useArticlesContract()
  const { reviews } = useReviewsContract()
  const { users } = useUsersContract()

  const mobileNav = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // useState
  const [count, setCount] = useState(0)
  const [notifs, setNotifs] = useState([])

  //Color mode
  const { colorMode, toggleColorMode } = useColorMode()

  // get notifications
  useEffect(() => {
    const getNotifs = async () => {
      const eventTab = []

      // Item events
      const banItemEvents = await governance.queryFilter("Voted")
      for (const event of banItemEvents) {
        const notifType = itemType(
          event.args.contractAddress,
          articles,
          reviews
        )
        const nbOfVote = await voteProgression(
          governance,
          "Voted",
          event.args.contractAddress,
          event.args.itemID.toNumber(),
          null
        )
        const obj = {
          notifType,
          who: event.args.userID.toNumber(),
          itemID: event.args.itemID.toNumber(),
          progression: nbOfVote.length,
          blockNumber: event.blockNumber,
          date: 0
        }
        eventTab.push(obj)
      }

      // user events
      const userEvents = await governance.queryFilter("UserVoted")
      for (const event of userEvents) {
        const notifType =
          event.args.voteType === 0 ? "Accept an user" : "Ban an user"
        const nbOfVote = await voteProgression(
          governance,
          "UserVoted",
          null,
          event.args.subjectUserID.toNumber(),
          null
        )
        const obj = {
          notifType,
          who: event.args.userID.toNumber(),
          itemID: event.args.subjectUserID.toNumber(),
          progression: nbOfVote.length,
          blockNumber: event.blockNumber,
          date: 0
        }
        eventTab.push(obj)
      }

      // register event
      const registerEvents = await users.queryFilter("Registered")
      for (const event of registerEvents) {
        // check if id is approved
        const { status } = await users.userInfo(event.args.userID.toNumber())
        if (status === 2) {
          continue
        }
        const obj = {
          notifType: "User registration pending",
          who: event.args.userID.toNumber(),
          itemID: event.args.userID.toNumber(),
          progression: 0,
          blockNumber: event.blockNumber,
          date: 0
        }
        eventTab.push(obj)
      }

      // sort by blockNumber
      const sortedTab = eventTab.sort((a, b) => b.blockNumber - a.blockNumber)
      setNotifs(sortedTab)
    }
    if (governance && articles && reviews) {
      getNotifs()
      // listen event
    }
    return () => {
      setNotifs([])
    }
  }, [governance, articles, users, reviews])

  // Get informations on governance actions
  useEffect(() => {
    setCount(0)
    userList.forEach((el) => {
      if (el.status === "Pending") {
        setCount((c) => c + 1) // update count
      }
    })
  }, [userList])

  //    Color Value
  const bg = useColorModeValue("white", "grayBlue.900")
  const co = useColorModeValue("main", "second")
  const button = useColorModeValue("colorMain", "colorSecond")

  return (
    <>
      <Box
        zIndex="400"
        bg={bg}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        shadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <Heading fontWeight="bold" fontFamily="title" as="h1" ml="2">
              <Link _hover={{ textDecoration: "none" }} as={RouterLink} to="/">
                <Text as="span" color={co}>
                  Co
                </Text>
                Science
              </Link>
            </Heading>
          </Flex>

          <HStack display="flex" alignItems="center" spacing={1}>
            <HStack
              spacing={3}
              mr={1}
              color="brand.500"
              display={{ base: "none", lg: "inline-flex" }}
            >
              <HeaderLinks user={userData} />
            </HStack>

            <Box display={{ base: "inline-flex", lg: "none" }} zIndex="sticky">
              <IconButton
                display={{ base: "flex", lg: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="ghost"
                icon={<HamburgerIcon />}
                onClick={mobileNav.onOpen}
              />

              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
              >
                <CloseButton
                  aria-label="Close menu"
                  onClick={mobileNav.onClose}
                />

                <HeaderLinks
                  user={userData}
                  isOpen={mobileNav.isOpen}
                  onClose={mobileNav.onClose}
                />
              </VStack>
            </Box>
            <HStack
              spacing={3}
              display={mobileNav.isOpen ? "none" : "flex"}
              alignItems="center"
            >
              <IconButton
                variant="ghost"
                size="sm"
                onClick={toggleColorMode}
                borderRadius="full"
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </IconButton>

              <Box position="relative" display="inline-block">
                <IconButton
                  boxSize={6}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  variant="outline"
                  color={button}
                  aria-label="Bell notification"
                  icon={<BellIcon />}
                  onClick={onOpen}
                  to="/list-of-users"
                  borderRadius="full"
                />
                <Badge
                  position="absolute"
                  top="-1px"
                  right="-1px"
                  px={2}
                  py={1}
                  fontSize="xs"
                  fontWeight="bold"
                  lineHeight="none"
                  color="red.100"
                  transform="translate(50%,-50%)"
                  bg="red.600"
                  rounded="full"
                  colorScheme="purple"
                >
                  {count}
                </Badge>
                {/* DRAWER NOTIFS */}
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Governance notifications</DrawerHeader>

                    <DrawerBody>
                      {notifs.map((notif) => {
                        return (
                          <Box
                            mb="4"
                            borderRadius="5"
                            p="2"
                            bg="green.100"
                            key={notif.blockNumber}
                          >
                            <Notifs notif={notif} />
                          </Box>
                        )
                      })}
                    </DrawerBody>

                    <DrawerFooter>
                      <Text>FOOTER</Text>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Box>
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  )
}

export default Header
