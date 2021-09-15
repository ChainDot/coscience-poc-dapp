import { Box, Flex, Link, Text } from "@chakra-ui/layout"
import { Link as RouterLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress"

const Notifs = ({ notif, onClose }) => {
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [notifInfo, setNotifInfo] = useState({
    link: "/",
    bg: "gray",
    voterName: "IPFS problem",
    userName: "",
    itemDescription: "",
    date: 0
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
      } else {
        // ban item
      }

      switch (notif.notifType) {
        case "User registration pending":
          bg = "yellow.100"
          link = `/profile/${notif.who}`
          voterName = ""
          setNotifInfo({ userName, bg, link, voterName, date })
          break
        case "Vote for ban an user":
          bg = "orange.100"
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
          return

        case "Ban a comment":
          bg = "orange.200"
          link = `/article/${notif.itemID}`
          itemDescription = `Comment n°${notif.itemID}`
          setNotifInfo((a) => {
            return { ...a, bg, link, voterName, itemDescription, date }
          })
          return
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

  return (
    <Box mb="4" borderRadius="5" p="2" bg={notifInfo.bg}>
      <Flex justifyContent="space-between">
        <Flex flexDirection="column">
          <Text fontWeight="bold" fontSize="lg">
            {notif.notifType}
          </Text>
          <Text as="span" fontSize="xs" textTransform="uppercase" color="gray">
            {notifInfo.date}
          </Text>
          <Text>
            {notifInfo.voterName
              ? `Vote emitted by ${notifInfo.voterName}`
              : ""}
          </Text>
          <Link onClick={onClose} as={RouterLink} to={notifInfo.link}>
            {notifInfo.userName
              ? notifInfo.userName
              : notifInfo.itemDescription}
          </Link>
        </Flex>
        <CircularProgress
          me="4"
          value={notif.progression}
          max="5"
          color="black"
          my="auto"
        >
          <CircularProgressLabel>{notif.progression}/5</CircularProgressLabel>
        </CircularProgress>
      </Flex>
    </Box>
  )
}

export default Notifs
