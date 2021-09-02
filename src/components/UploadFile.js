import React, { useRef, useState } from "react"
import { Box, Button, Flex, InputGroup, Text } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"

const UploadFile = ({ file, setFile }) => {
  const [pdfSrc, setPdfSrc] = useState()

  const inputRef = useRef(null)

  function addFile(e) {
    const url = URL.createObjectURL(e.target.files[0])
    setFile(e.target.files[0])
    setPdfSrc(url)
  }

  return (
    <>
      <InputGroup>
        <input
          onChange={addFile}
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
        />
        <Flex mb="4" alignItems="center">
          <Button
            display="flex"
            me="4"
            leftIcon={<AttachmentIcon />}
            colorScheme="colorSecond"
            onClick={() => inputRef.current.click()}
          >
            Choose a file
          </Button>
          <Text>{file?.name}</Text>
        </Flex>
      </InputGroup>
      {pdfSrc && (
        <Box mb="4" as="embed" src={pdfSrc} width="100%" height="500px" />
      )}
    </>
  )
}

export default UploadFile
