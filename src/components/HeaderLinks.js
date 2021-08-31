import { Button, Flex } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"

const HeaderLinks = ({ user, isOpen, onClose }) => {
  return (
    <Flex
      key={user.id}
      alignItems="center"
      flexDirection={isOpen ? "column" : ""}
      w={isOpen ? "full" : ""}
    >
      <Button
        w={isOpen ? "full" : ""}
        onClick={onClose}
        as={Link}
        to="/"
        variant="ghost"
      >
        Home
      </Button>
      <Button
        disabled={user.id === undefined}
        as={Link}
        to={`/profile/${user.id}`}
        variant="ghost"
        onClick={onClose}
        w={isOpen ? "full" : ""}
      >
        Profile
      </Button>
      <Button
        w={isOpen ? "full" : ""}
        onClick={onClose}
        as={Link}
        to="/list-of-users"
        variant="ghost"
      >
        List of users
      </Button>
      <Button
        w={isOpen ? "full" : ""}
        onClick={onClose}
        variant="ghost"
        as={Link}
        to="/upload-article"
      >
        Upload Article
      </Button>
      <Button
        w={isOpen ? "full" : ""}
        onClick={onClose}
        variant="ghost"
        as={Link}
        to="/about"
      >
        About
      </Button>
      <Button
        onClick={onClose}
        as={Link}
        to="/sign-up"
        colorScheme="teal"
        size="sm"
      >
        Sign up
      </Button>
    </Flex>
  )
}

export default HeaderLinks
