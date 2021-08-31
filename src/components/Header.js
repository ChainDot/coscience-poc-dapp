import React from "react"
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  VStack,
  CloseButton,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react"
import { HamburgerIcon, MoonIcon, SunIcon, Search2Icon } from "@chakra-ui/icons"

import { useColorMode } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useUsersContract } from "../hooks/useUsersContract"

//in small sizeburgerMenu, close not only with cross but add a component for clicking outside menu too.
const Header = () => {
  //login for the sign up to add.
  const [, user] = useUsersContract()
  const bg = useColorModeValue("white", "gray.800")
  const mobileNav = useDisclosure()

  //Color mode
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <React.Fragment>
      <chakra.header
        bg={bg}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        shadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <chakra.a
              href="/"
              title="Coscience Home Page"
              display="flex"
              alignItems="center"
            >
              <VisuallyHidden>Coscience</VisuallyHidden>
            </chakra.a>
            <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
              Coscience
            </chakra.h1>
          </Flex>
          <HStack display="flex" alignItems="center" spacing={1}>
            <HStack
              spacing={3}
              mr={1}
              color="brand.500"
              display={{ base: "none", lg: "inline-flex" }}
            >
              <Button as={Link} to="/" variant="ghost">
                Home
              </Button>

              <Button
                disabled={user.id === undefined}
                as={Link}
                to={`/profile/${user.id}`}
                variant="ghost"
              >
                Profile
              </Button>

              <Button as={Link} to="/list-of-users" variant="ghost">
                List of users
              </Button>

              <Button variant="ghost" as={Link} to="/upload-article">
                Upload Article
              </Button>
              <Button variant="ghost" as={Link} to="/about">
                About
              </Button>
              <Button as={Link} to="/sign-up" colorScheme="teal" size="sm">
                Sign up
              </Button>
              <IconButton variant="ghost" size="sm" onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </IconButton>
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
                flexDirection="column"
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

                <Button as={Link} to="/" w="full" variant="ghost">
                  Home
                </Button>
                <Button
                  as={Link}
                  disabled={user.id === undefined}
                  to={`/profile/${user.id}`}
                  variant="ghost"
                  w="full"
                >
                  Profile
                </Button>
                <Button as={Link} to="/list-of-users" w="full" variant="ghost">
                  List of users
                </Button>
                <Button as={Link} to="/upload-article" w="full" variant="ghost">
                  Upload Article
                </Button>
                <Button as={Link} to="/about" w="full" variant="ghost">
                  About
                </Button>
                <Button as={Link} to="/sign-up" w="full" variant="ghost">
                  Sign up
                </Button>
              </VStack>
            </Box>
            <HStack
              spacing={3}
              display={mobileNav.isOpen ? "none" : "flex"}
              alignItems="center"
            >
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
      </chakra.header>
    </React.Fragment>
  )
}

export default Header
