import { Link, Text, useToast } from "@chakra-ui/react"
import { useState } from "react"

export const useMetamask = () => {
  const [status, setStatus] = useState("")
  const toast = useToast()

  // function to call blockchain function
  const contractCall = async (contract, functionName, params) => {
    const nbOfParam = params.length
    let tx
    try {
      setStatus("Waiting for confirmation") // UX

      // transaction
      switch (nbOfParam) {
        case 0:
          tx = await contract[functionName]()
          break
        case 1:
          tx = await contract[functionName](params[0]) // .functionName
          break
        case 2:
          tx = await contract[functionName](params[0], params[1])
          break
        case 3:
          tx = await contract[functionName](params[0], params[1], params[2])
          break
        case 4:
          tx = await contract[functionName](
            params[0],
            params[1],
            params[2],
            params[3]
          )
          break
        default:
          console.log("Wrong number of params")
      }

      setStatus("Pending") // UX
      await tx.wait()
      setStatus("Success") // UX
      toast({
        title: "Transaction completed",
        description: (
          <>
            <Text isTruncated>Hash: {tx.hash})</Text>
            <Link
              isExternal
              href={`https://rinkeby.etherscan.io/tx/${tx.hash}`}
            >
              See on Etherscan
            </Link>
          </>
        ),
        status: "success",
        duration: 7000,
        isClosable: true,
      })
    } catch (e) {
      // error management
      let errorMessage
      console.log(e.code)
      console.log(e.message)
      switch (e.code) {
        case "UNPREDICTABLE_GAS_LIMIT":
          errorMessage = e.error.message
          break
        case 4001:
          errorMessage = e.message
          break
        case "INVALID_ARGUMENT":
          errorMessage = "Wrong argument: " + e.message
          break
        default:
          errorMessage = "unknown error"
          break
      }
      setStatus("Failed") // UX
      toast({
        title: "Transaction failed",
        description: errorMessage,
        status: "error",
        duration: 7000,
        isClosable: true,
      })
      tx = "Error"
    }

    return tx
  }

  return [status, contractCall] // = useMetamask()
}
