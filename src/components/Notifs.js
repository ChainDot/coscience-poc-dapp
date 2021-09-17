import { Box, Flex, Link, Text, Icon } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress"
import {
  FaUserSlash,
  FaUserCheck,
  FaUserClock,
  FaBan,
  FaUserLock
} from "react-icons/fa"

const Notifs = ({ notif, onClose }) => {
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [notifInfo, setNotifInfo] = useState({
    link: "/",
    bg: "gray",
    voterName: "IPFS problem",
    userName: "",
    itemDescription: "",
    date: 0,
    address: ""
  })

  // get IPFS information
  useEffect(() => {
    ;(async () => {
      let bg = "gray"
      let link = "/"
      let userName = ""
      let itemDescription = ""
      let date = new Date(notif.timestamp * 1000)
      date = date.toLocaleString()

      // who voted
      const voter = await users.userInfo(notif.who)
      const names = await readIPFS(voter.nameCID)
      let voterName = names.firstName + " " + names.lastName

      if (!notif.notifType.startsWith("Ban")) {
        // user related
        const struct = await users.userInfo(notif.itemID)
        const result = await readIPFS(struct.nameCID)
        userName = result.firstName + " " + result.lastName
      }

      switch (notif.notifType) {
        case "User registration pending":
          bg = "yellow.100"
          link = `/profile/${notif.who}`
          voterName = ""
          setNotifInfo({ userName, bg, link, voterName, date })
          break
        case "Vote for ban an user":
          bg = "red.300"
          link = `/profile/${notif.who}`
          setNotifInfo({ userName, bg, link, voterName, date })
          break
        case "Vote for accept an user":
          bg = "green.100"
          link = `/profile/${notif.who}`
          setNotifInfo({ userName, bg, link, voterName, date })
          break

        case "Ban an article":
          bg = "red.100"
          link = `/article/${notif.itemID}`
          itemDescription = `Article n°${notif.itemID}`
          setNotifInfo((a) => {
            return { ...a, bg, link, voterName, itemDescription, date }
          })
          break

        case "Ban a review":
          bg = "red.200"
          link = `/article/${notif.itemID}`
          itemDescription = `Review n°${notif.itemID}`
          setNotifInfo((a) => {
            return { ...a, bg, link, voterName, itemDescription, date }
          })
          break

        case "Ban a comment":
          bg = "orange.200"
          link = `/article/${notif.itemID}`
          itemDescription = `Comment n°${notif.itemID}`
          setNotifInfo((a) => {
            return { ...a, bg, link, voterName, itemDescription, date }
          })
          break

        case "Recover demand created":
          bg = "blue.100"
          link = `/profile/${notif.who}`
          userName = voterName
          voterName = ""
          setNotifInfo((a) => {
            return {
              ...a,
              bg,
              link,
              voterName,
              date,
              address: notif.address,
              userName
            }
          })
          break
        default:
          throw new Error(`Unknown notification type ${notif.notifType}`)
      }
    })()
    return () => {
      setNotifInfo({
        link: "/",
        bg: "gray",
        voterName: "IPFS problem",
        userName: "",
        itemDescription: ""
      })
    }
  }, [readIPFS, users, notif])

  // colorValue
  // const scheme = useColorModeValue('colorMain', 'colorSecond')
  // const txt = useColorModeValue('grayBlue.900', 'white')
  // const bgTitle = useColorModeValue('grayOrange.800', 'grayBlue.800')

  return (
    <Box
      mb="4"
      borderRadius="5"
      p="5"
      bg={notifInfo.bg}
      color="grayBlue.800"
      boxShadow="lg"
    >
      <Flex justifyContent="space-between">
        <Flex flexDirection="column" flex="1">
          <Text fontWeight="bold" fontSize="lg">
            {notif.notifType}
          </Text>
          <Text>
            {notifInfo.voterName
              ? `Vote emitted by ${notifInfo.voterName}`
              : ""}
          </Text>
          <Link
            onClick={onClose}
            as={RouterLink}
            to={notifInfo.link}
            aria-label="notification subject redirection"
          >
            {notifInfo.userName
              ? notifInfo.userName
              : notifInfo.itemDescription}
          </Link>
          <Text as="span" fontSize="xs" textTransform="uppercase" color="gray">
            {notifInfo.date}
          </Text>
          {notifInfo.address ? (
            <Text maxW="20ch" isTruncated>
              With {notifInfo.address}
            </Text>
          ) : (
            ""
          )}
        </Flex>
        <Flex flexDirection="row" alignItems="center">
          <Box>
            {notif.notifType === "Recover demand created" ? (
              <Icon as={FaUserLock} w="8" h="8" />
            ) : (
              ""
            )}
            {notif.notifType === "User registration pending" ? (
              <Icon as={FaUserClock} w="8" h="8" />
            ) : (
              ""
            )}
            {notif.notifType === "Vote for ban an user" ? (
              <Icon as={FaUserSlash} w="8" h="8" />
            ) : (
              ""
            )}
            {notif.notifType === "Ban an article" ||
            notif.notifType === "Ban a review" ||
            notif.notifType === "Ban a comment" ? (
              <Icon as={FaBan} w="8" h="8" />
            ) : (
              ""
            )}
            {notif.notifType === "Vote for accept an user" ? (
              <Icon as={FaUserCheck} w="8" h="8" />
            ) : (
              ""
            )}
          </Box>
          <CircularProgress
            me="4"
            value={notif.progression}
            max="5"
            color="black"
            my="auto"
            ms="5"
          >
            <CircularProgressLabel>{notif.progression}/5</CircularProgressLabel>
          </CircularProgress>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Notifs
