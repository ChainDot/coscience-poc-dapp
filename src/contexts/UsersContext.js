import { createContext, useEffect, useState } from "react"
import { useContract } from "../web3hook/useContract"
import { contractAddress, contractABI } from "../contracts/users"
import { useWeb3 } from "../web3hook/useWeb3"
import { useIPFS } from "../hooks/useIPFS"
import { getUserData } from "../hooks/useUsersContract"

export const UsersContext = createContext(null)

const UsersContextProvider = ({ children }) => {
  const [{ contract, mode }] = useContract(contractAddress, contractABI)

  // utils
  const { state } = useWeb3()
  const { account } = state

  const [, readIPFS] = useIPFS()
  const [userData, setUserData] = useState({})
  const [userList, setUserList] = useState([])

  const [owner, setOwner] = useState("")
  const [isOwner, setIsOwner] = useState(false)

  // get user data
  useEffect(() => {
    const connectedUser = async () => {
      if (contract && state.networkName === "rinkeby") {
        const id = await contract.profileID(state.account)
        const userObj = await getUserData(contract, id.toNumber())
        const { firstName, lastName } = await readIPFS(userObj.nameCID)
        setUserData({ ...userObj, firstName, lastName })
      }
    }
    connectedUser()
    contract?.on("Registered", connectedUser)

    return () => {
      setUserData({})
      contract?.off("Registered", connectedUser)
    }
  }, [state.account, contract, readIPFS, state.networkName])

  // get list of user
  useEffect(() => {
    const createList = async () => {
      if (contract && state.networkName === "rinkeby") {
        const listOfUser = []
        const nb = await contract.nbOfUsers()
        for (let i = 1; i <= nb; i++) {
          let userObj = await getUserData(contract, i)
          const { firstName, lastName } = await readIPFS(userObj.nameCID)
          userObj = { ...userObj, firstName, lastName }
          listOfUser.push(userObj)
        }
        setUserList(listOfUser)
      }
    }
    createList()
    contract?.on("Approved", createList)
    contract?.on("Registered", createList)

    // clean up to set value if component is unmount
    return () => {
      setUserList([])
      contract?.off("Approved", createList)
      contract?.off("Registered", createList)
    }
  }, [contract, readIPFS, state.networkName])

  // get owner
  useEffect(() => {
    if (contract) {
      const getOwner = async () => {
        try {
          const owner = await contract.owner()
          if (owner.toLowerCase() === account.toLowerCase()) {
            setIsOwner(true)
          }
          setOwner(owner)
        } catch (e) {
          console.log(e)
        }
      }
      getOwner()
    }
  }, [contract, account])

  return (
    <UsersContext.Provider
      value={[contract, mode, userData, userList, owner, isOwner]}
    >
      {children}
    </UsersContext.Provider>
  )
}

export default UsersContextProvider
