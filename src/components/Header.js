import React from "react"
import {
  Box,
  Flex,
  useColorModeValue,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  CloseButton,
  InputGroup,
  InputLeftElement,
  Input,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react"
import { HamburgerIcon, MoonIcon, SunIcon, Search2Icon } from "@chakra-ui/icons"

import { useColorMode } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { useUsersContract } from "../hooks/useUsersContract"
import HeaderLinks from "./HeaderLinks"

//in small sizeburgerMenu, close not only with cross but add a component for clicking outside menu too.
const Header = () => {
  //login for the sign up to add.
  const [, user] = useUsersContract()
  const bg = useColorModeValue("white", "gray.800")
  const mobileNav = useDisclosure()

  //Color mode
  const { colorMode, toggleColorMode } = useColorMode()

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
            <Heading as="h1" fontWeight="medium" ml="2">
              <Link _hover={{ textDecoration: "none" }} as={RouterLink} to="/">
                <Text as="span" color="orange.500">
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
              <HeaderLinks user={user} />
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
                  user={user}
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
              <IconButton variant="ghost" size="sm" onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </IconButton>

              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Search2Icon />}
                />
                <Input type="tel" placeholder="Search..." />
              </InputGroup>
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  )
}

export default Header
