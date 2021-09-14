import { Box, Text } from "@chakra-ui/layout"
import { useEffect, useState } from "react"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"

const Notifs = ({ notif }) => {
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [notifInfo, setNotifInfo] = useState({
    firstName: "IPFS",
    lastName: "not charged yet"
  })

  // get IPFS information
  useEffect(() => {
    ;(async () => {
      switch (notif.notifType) {
        case "User registration pending":
          const struct = await users.userInfo(notif.who)
          const { firstName, lastName } = await readIPFS(struct.nameCID)
          setNotifInfo({ firstName, lastName })
          return
        case "Ban an user":
          return
        case "Accept an user":
          return
        case "Ban a review":
          return
        case "Ban an article":
          return
        case "Ban a comment":
          return
        default:
          throw new Error(`Unknown notification type ${notif.notifType}`)
      }
      // sender info

      // receiver info
    })()
  }, [readIPFS, users, notif.who])

  return (
    <>
      <Text fontSize="lg">{notif.notifType}</Text>
      <Text>{notif.who}</Text>
    </>
  )
}

export default Notifs
