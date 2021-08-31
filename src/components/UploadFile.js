import React, { useState } from "react"
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useIPFS } from "../hooks/useIPFS"

const UploadFile = () => {
  const [, , , pinFile] = useIPFS()
  const [file, setFile] = useState()
  const [pdfSrc, setPdfSrc] = useState()

  function addFile(e) {
    const url = URL.createObjectURL(e.target.files[0])
    setFile(e.target.files[0])
    setPdfSrc(url)
  }

  function debug() {
    console.log(setPdfSrc)
    console.log(file)
  }

  async function sendFile() {
    pinFile(file, setPdfSrc)
  }

  return (
    <>
      <FormControl>
        <FormLabel>Choose a file</FormLabel>
        <Input onChange={addFile} type="file" />
        {pdfSrc && <embed src={pdfSrc} width="800px" height="1000px" />}
      </FormControl>

      <Button onClick={debug}>debug</Button>
      <Button disabled={file === undefined} onClick={sendFile}>
        Send file
      </Button>
    </>
  )
}

export default UploadFile
