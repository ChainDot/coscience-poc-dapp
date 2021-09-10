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
  Text,
  Link,
} from "@chakra-ui/react"
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons"

import { useColorMode } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { useUsersContract } from "../hooks/useUsersContract"
import HeaderLinks from "./HeaderLinks"

//in small sizeburgerMenu, close not only with cross but add a component for clicking outside menu too.
const Header = () => {
  //login for the sign up to add.<Badge colorScheme="purple">New</Badge>
  const { userData, userList } = useUsersContract()
  const bg = useColorModeValue("white", "grayBlue.900")
  const co = useColorModeValue("main", "second")
  const mobileNav = useDisclosure()

  // useState
  const [count, setCount] = useState(0)

  //Color mode
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    setCount(0)
    userList.forEach((el) => {
      if (el.status === "Pending") {
        setCount((c) => c + 1) // update count
      }
    })
  }, [userList])

  const scheme = useColorModeValue("colorMain", "colorSecond")

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
                  colorScheme={scheme}
                  aria-label="Bell notification"
                  icon={<BellIcon />}
                  as={RouterLink}
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
              </Box>
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  )
}

export default Header
