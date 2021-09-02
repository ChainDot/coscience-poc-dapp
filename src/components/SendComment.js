import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  useDisclosure,
  Collapse,
  Heading,
} from "@chakra-ui/react"
import { useState } from "react"
import { useMetamask } from "../hooks/useMetamask"
import { useCommentsContract } from "../hooks/useCommentsContract"
import { useIPFS } from "../hooks/useIPFS"

const SendComment = ({ targetAddress, id }) => {
  const [comments] = useCommentsContract()
  const [status, contractCall] = useMetamask()
  const [pinJsObject, , ipfsStatus, , unPin] = useIPFS()
  const { isOpen, onToggle } = useDisclosure()

  const [content, setContent] = useState("")

  async function post() {
    const contentHash = await pinJsObject({ version: 0.1, content })
    // post(comment,articleAddress, articleID)
    const tx = await contractCall(comments, "post", [
      contentHash,
      targetAddress,
      id,
    ])

    // unpin
    if (tx === "Error") {
      await unPin(contentHash)
    }
    setContent("")
  }

  return (
    <>
      <Box minW="49%">
        <Button
          display="flex"
          ms={{ base: "", lg: "auto" }}
          onClick={onToggle}
          colorScheme="orange"
        >
          {isOpen ? "X" : "Add comment"}
        </Button>

        <Box mx="auto" display="flex" flexDirection="column">
          <Collapse in={isOpen} animateOpacity>
            <Box p="40px" mt="4" rounded="md" shadow="md">
              <FormControl mb="4">
                <FormLabel>
                  <Heading>Write a comment</Heading>
                </FormLabel>
                <Textarea
                  value={content}
                  placeholder="Your comment..."
                  onChange={(e) => setContent(e.target.value)}
                />
              </FormControl>
              <Button
                colorScheme="orange"
                onClick={post}
                isLoading={
                  status.startsWith("Waiting") ||
                  status.startsWith("Pending") ||
                  ipfsStatus.startsWith("Pinning")
                }
                loadingText={
                  ipfsStatus.startsWith("Pinning") ? ipfsStatus : status
                }
                disabled={
                  !content.length ||
                  status.startsWith("Waiting") ||
                  status.startsWith("Pending") ||
                  ipfsStatus.startsWith("Pinning")
                }
              >
                Submit
              </Button>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </>
  )
}

export default SendComment
