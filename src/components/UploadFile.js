import React, { useState } from "react"
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useIPFS } from "../hooks/useIPFS"

const UploadFile = () => {
  const [, , status, pinFile, unPin] = useIPFS()
  const [file, setFile] = useState()
  const [pdfSrc, setPdfSrc] = useState()

  /*
  const pinOnIpfs = async (file) => {
    try {
      let formatData = new FormData() // {}
      formatData.append("file", file) // {"file": file} - PINATA {'file': readableStream}

      console.log(process.env.REACT_APP_PINATA_KEY)
      console.log(process.env.REACT_APP_PINATA_SECRET_KEY)

      const hash = await axios
        .post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, formatData, {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formatData._boundary}`,
            pinata_api_key: process.env.REACT_APP_PINATA_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
          },
        })
        .then((result) => result.data.IpfsHash)
      console.log(hash)
      return hash
    } catch (e) {
      console.error(e)
    }
  }
  */

  function addFile(e) {
    const url = URL.createObjectURL(e.target.files[0])
    setFile(e.target.files[0])
    setPdfSrc(url)
  }

  async function sendFile() {
    const hash = await pinFile(file)
    console.log(hash)
  }

  return (
    <>
      <FormControl>
        <FormLabel>Choose a file</FormLabel>
        <Input onChange={addFile} type="file" />
        {pdfSrc && <embed src={pdfSrc} width="800px" height="1000px" />}
      </FormControl>

      <Button
        loadingText={status}
        isLoading={status.startsWith("Pinning")}
        disabled={file === undefined || status.startsWith("Pinning")}
        onClick={sendFile}
      >
        Pin to IPFS
      </Button>
      <Button
        onClick={() =>
          unPin("bafkreicify3xzvy3ndpg4t43iy37mxmajdnxvjssgruijngval5dh7p7bu")
        }
      >
        Unpin
      </Button>
    </>
  )
}

export default UploadFile
