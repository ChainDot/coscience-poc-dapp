import { useContext } from 'react'
import { UsersContext } from '../contexts/UsersContext'

// Pure function
const enumStatus = (status) => {
  switch (status) {
    case 0:
      return 'Not approved'
    case 1:
      return 'Pending'
    case 2:
      return 'Approved'
    default:
      return 'Unknown status'
  }
}

// Pure function
export const getUserData = async (users, id) => {
  const struct = await users.userInfo(id)

  const nameCID = struct.nameCID
  const profileCID = struct.profileCID
  const status = enumStatus(struct.status)
  const walletList = struct.walletList
  const nbOfWallet = struct.walletList.length

  const userObj = {
    id: Number(id),
    nameCID,
    profileCID,
    status,
    walletList,
    nbOfWallet
  }
  return userObj
}

// hooks
export const useUsersContract = () => {
  // call the context
  const [users, mode, userData, userList, owner, isOwner] =
    useContext(UsersContext)

  // control call of the hook
  if (users === undefined) {
    throw new Error(
      `It seems that you are trying to use UsersContext outside of its provider`
    )
  }

  // first: return contract for utilisation
  return { users, userData, userList, getUserData, owner, isOwner }
}
