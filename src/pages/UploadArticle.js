import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { useState } from "react"
import UploadFile from "../components/UploadFile"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useMetamask } from "../hooks/useMetamask"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"

const UploadArticle = () => {
  const [articles] = useArticlesContract()
  const [, user] = useUsersContract()
  const [status, contractCall] = useMetamask()
  const [pinJsObject, , ipfsStatus, pinFile, unPin] = useIPFS()

  const [abstract, setAbstract] = useState("")
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [coAuthors, setCoAuthors] = useState([])
  const [file, setFile] = useState()

  //Color Mode
  const bg = useColorModeValue("white", "gray.800")

  function addCoAuthor(code, index, input) {
    switch (code) {
      // add co author
      case 0:
        const coAuthor = { address: "", active: true }
        setCoAuthors((a) => [...a, coAuthor])
        break
      // change coAuthor address
      case 1:
        setCoAuthors((a) =>
          a.map((coAuthor, i) => {
            if (index === i) {
              return { ...coAuthor, address: input }
            } else {
              return coAuthor
            }
          })
        )
        // index => address
        break
      default:
        console.log("Wrong code")
        break
    }
  }

  const removeItem = (index) => {
    setCoAuthors((a) => a.filter((coAuthor, i) => index !== i))
  }

  async function publish() {
    const coAuthorArray = coAuthors.map((coAuthor) => {
      return coAuthor.address
    })
    // transform into CID
    let abstractCID = ""
    let contentCID = ""
    if (user.status === "Approved") {
      let hash = "No pdf joined"
      if (file !== undefined) {
        hash = await pinFile(file)
      }
      const body = { version: 0.1, content, pdfFile: hash }
      contentCID = await pinJsObject(body)
      const header = { version: 0.1, title, abstract, content: contentCID }
      abstractCID = await pinJsObject(header)
    }

    // push to the blockchain
    const tx = await contractCall(articles, "publish", [
      coAuthorArray,
      abstractCID,
      contentCID,
    ])

    // unpin content if revert
    if (user.status === "Approved") {
      if (tx === "Error") {
        await unPin(abstractCID)
        await unPin(contentCID)
      }
    }

    // reset inputs
    setAbstract("")
    setCoAuthors([])
    setContent("")
    setTitle("")
  }

  return (
    <>
      <Box p="10">
        <Container
          shadow="lg"
          maxW="container.lg"
          bg={bg}
          p="10"
          borderRadius="50"
        >
          <Heading textAlign="center" mb="2">
            Publish an article
          </Heading>
          <Box display="flex" flexDirection="column" mx="auto" maxW="75%">
            {/* CO AUTHOR */}
            <Heading fontSize="3xl" as="h3">
              Header
            </Heading>

            <FormControl mb="4">
              <FormLabel>Co-Authors</FormLabel>
              {coAuthors.map((coAuthor, index) => {
                return (
                  <Flex key={index} mb="4">
                    {coAuthor.active ? (
                      <>
                        <Input
                          value={coAuthor.address}
                          onChange={(e) =>
                            addCoAuthor(1, index, e.target.value)
                          }
                          placeholder="0x000000000000"
                          borderEndRadius="0"
                        />

                        <Button
                          borderStartRadius="0"
                          onClick={() => removeItem(index)}
                          colorScheme="red"
                        >
                          <MinusIcon />
                        </Button>
                      </>
                    ) : (
                      ""
                    )}
                  </Flex>
                )
              })}
              <Button onClick={() => addCoAuthor(0)} colorScheme="colorSecond">
                <AddIcon />
              </Button>
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Science and co."
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Abstract</FormLabel>
              <Textarea
                value={abstract}
                placeholder="Resume the article..."
                onChange={(e) => setAbstract(e.target.value)}
              />
            </FormControl>
            <Heading fontSize="3xl" as="h3">
              Content
            </Heading>
            <FormControl mb="4">
              <FormLabel>Introduction</FormLabel>
              <Textarea
                value={content}
                minH="40"
                placeholder="Content of your article..."
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
            <UploadFile file={file} setFile={setFile} />
            <Button
              isLoading={
                status.startsWith("Waiting") ||
                status.startsWith("Pending") ||
                ipfsStatus.startsWith("Pinning")
              }
              loadingText={
                ipfsStatus.startsWith("Pinning") ? ipfsStatus : status
              }
              disabled={
                !title.length ||
                !abstract.length ||
                !content.length ||
                status.startsWith("Waiting") ||
                status.startsWith("Pending") ||
                ipfsStatus.startsWith("Pinning")
              }
              onClick={publish}
              colorScheme="colorMain"
            >
              Submit
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default UploadArticle
