import { Link, Text, useToast } from "@chakra-ui/react"
import { useCallback, useState } from "react"

// yarn add axios
const axios = require("axios")

// yarn add @pinata/sdk
const pinataSDK = require("@pinata/sdk")
const pinata = pinataSDK(
  process.env.REACT_APP_PINATA_KEY,
  process.env.REACT_APP_PINATA_SECRET_KEY
)

export const useIPFS = () => {
  const [status, setStatus] = useState("")
  const toast = useToast()

  const pinJsObject = async (obj) => {
    let result
    try {
      setStatus("Pinning to IPFS")

      // use the SDK
      result = await pinata.pinJSONToIPFS(obj, {
        pinataOptions: {
          cidVersion: 1
        }
      })
    } catch (e) {
      setStatus("Failed to pin")
      toast({
        title: "Content not pinned to IPFS",
        description: (
          <>
            <Text>Message: {e.message} </Text>
          </>
        ),
        status: "error",
        duration: 7000,
        isClosable: true
      })
      throw e
    }
    setStatus("Successful pinning")
    toast({
      title: "Content pinned to IPFS",
      description: (
        <>
          <Text isTruncated>CID: {result.IpfsHash})</Text>
          <Text>Time: {result.Timestamp} </Text>
          <Text>Size: {result.PinSize} </Text>
          <Link isExternal href={`https://ipfs.io/ipfs/${result.IpfsHash}`}>
            See through a gateway
          </Link>
        </>
      ),
      status: "info",
      duration: 12000,
      isClosable: true
    })

    // return directly the CID of the content
    return result.IpfsHash
    // unpin in case of TX rejected
  }

  const pinFile = async (file) => {
    let response
    try {
      setStatus("Pinning to IPFS")

      let formatData = new FormData()
      formatData.append("file", file)

      const pinataOptions = JSON.stringify({ cidVersion: 1 })
      formatData.append("pinataOptions", pinataOptions)

      // pin file through API
      response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formatData,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formatData._boundary}`,
            pinata_api_key: process.env.REACT_APP_PINATA_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY
          }
        }
      )
    } catch (e) {
      // error in pinning
      setStatus("Failed to pin")
      toast({
        title: "Content not pinned to IPFS",
        description: (
          <>
            <Text>Message: {e.message} </Text>
          </>
        ),
        status: "error",
        duration: 7000,
        isClosable: true
      })
      throw e
    }
    // successful pinning
    setStatus("Successful pinning")
    toast({
      title: "Content pinned to IPFS",
      description: (
        <>
          <Text isTruncated>CID: {response.data.IpfsHash}</Text>
          <Text>Time: {response.data.Timestamp} </Text>
          <Text>Size: {response.data.PinSize} </Text>
          <Link
            isExternal
            href={`https://ipfs.io/ipfs/${response.data.IpfsHash}`}
          >
            See through a gateway
          </Link>
        </>
      ),
      status: "info",
      duration: 12000,
      isClosable: true
    })

    return response.data.IpfsHash
  }

  const unPin = async (cid) => {
    setStatus("Unpinnning")
    try {
      await pinata.unpin(cid)
      setStatus("Successful unpin")
      toast({
        title: "Content unpinned to IPFS",
        description: (
          <>
            <Text isTruncated>CID: {cid})</Text>
            <Text>
              Content unpinned because blockchain transaction have been reverted
            </Text>
          </>
        ),
        status: "warning",
        duration: 12000,
        isClosable: true
      })
    } catch (e) {
      setStatus("Unpin failed")
      toast({
        title: "Something went wrong to unpin content",
        description: (
          <>
            <Text>{e.details}</Text>
            <Text>Code: {e.reason}</Text>
          </>
        ),
        status: "error",
        duration: 12000,
        isClosable: true
      })
    }
  }

  // useEffect => readIPFS(cid) => change the above function in each call
  // [readIPFS]
  const readIPFS = useCallback(async (cid) => {
    // check for the first version of the dapp (some content with false CID)
    if (!cid.startsWith("baf")) {
      // by returning the cid, don't need try/catch anymore
      return cid
    }

    let response
    try {
      response = await axios({
        method: "get",
        url: `https://ipfs.io/ipfs/${cid}`, // cid : part of the function that change in each call
        timeout: 5000
      })
    } catch (e) {
      response = {
        data: "IPFS: too much time to get a response"
      }
      // add all keys??
      console.error(e.code)
    }
    return response.data
  }, [])

  return [pinJsObject, readIPFS, status, pinFile, unPin]
}
