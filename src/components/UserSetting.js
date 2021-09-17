import { EditIcon, PlusSquareIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useIPFS } from '../hooks/useIPFS'
import { useUsersContract } from '../hooks/useUsersContract'
import { useCall } from '../web3hook/useCall'

const UserSetting = ({ user }) => {
  const { users } = useUsersContract()
  const [status, contractCall] = useCall()
  const [pinJsObject, , ipfsStatus, , unPin] = useIPFS()

  const [addInput, setAddInput] = useState({
    address: false,
    edit: false
  })
  const [input, setInput] = useState('')

  const [laboratory, setLaboratory] = useState(user.laboratory)
  const [bio, setBio] = useState(user.bio)
  const [email, setEmail] = useState('')

  async function addWallet(code) {
    switch (code) {
      case 0:
        setAddInput({ address: true, edit: false })
        break
      case 1:
        await contractCall(users, 'addWallet', [input])
        setAddInput({ ...addInput, address: false })
        break
      case 2:
        setAddInput({ address: false, edit: false })
        break
      default:
        return false
    }
  }

  async function changeProfile(code) {
    switch (code) {
      case 0:
        setAddInput({ address: false, edit: true })
        break
      case 1:
        const profileObj = {
          version: 0.1,
          laboratory,
          bio,
          email,
          userInfo: user.nameCID
        }

        const profileCID = await pinJsObject(profileObj)

        const tx = await contractCall(users, 'editProfile', [profileCID])

        // unpin
        if (tx === 'Error') {
          await unPin(profileCID)
        } else {
          // unpin old content
          await unPin(user.profileCID)
        }

        setAddInput({ ...addInput, edit: false })

        break
      case 2:
        setAddInput({ address: false, edit: false })
        break
      default:
        return false
    }
  }

  return (
    <>
      <Button
        disabled={user.status !== 'Approved' || addInput.address}
        onClick={() => addWallet(0)}
        colorScheme='messenger'
        transition='0.3s '
        aria-label='add Wallet'
        leftIcon={<PlusSquareIcon />}
      >
        Wallets
      </Button>

      <Button
        ms='4'
        disabled={user.status !== 'Approved' || addInput.edit}
        onClick={() => changeProfile(0)}
        colorScheme='messenger'
        transition='0.3s '
        aria-label='Change profile'
        variant='outline'
        rightIcon={<EditIcon />}
      >
        Edit profile
      </Button>
      {addInput.address ? (
        <>
          {' '}
          <FormControl transition='0.3s '>
            <FormLabel>Ethereum address:</FormLabel>
            <Input
              mb='4'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='0x0000000000000000000000000000000000000000'
              bg='white'
            />
          </FormControl>
          <Button
            isLoading={
              status.startsWith('Waiting') ||
              status.startsWith('Pending') ||
              ipfsStatus.startsWith('Pinning')
            }
            loadingText={ipfsStatus.startsWith('Pinning') ? ipfsStatus : status}
            disabled={
              !input.length ||
              status.startsWith('Waiting') ||
              status.startsWith('Pending')
            }
            onClick={() => addWallet(1)}
            colorScheme='green'
            transition='0.3s'
            aria-label='submit button'
          >
            Submit
          </Button>
          <Button
            onClick={() => addWallet(2)}
            ms='4'
            colorScheme='red'
            transition='0.3s '
            aria-label='cancel button'
          >
            Cancel
          </Button>
        </>
      ) : addInput.edit ? (
        <>
          <FormControl>
            <FormLabel>Change laboratory:</FormLabel>
            <Input
              mb='4'
              value={laboratory}
              onChange={(e) => setLaboratory(e.target.value)}
              placeholder='MIT'
              bg='white'
            />
          </FormControl>
          <FormControl>
            <FormLabel>Change email:</FormLabel>
            <Input
              mb='4'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your@email.com'
              bg='white'
            />
          </FormControl>
          <FormControl>
            <FormLabel>Change bio:</FormLabel>
            <Input
              mb='4'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder='Your experience...'
              bg='white'
            />
          </FormControl>

          <Button
            isLoading={
              status.startsWith('Waiting') ||
              status.startsWith('Pending') ||
              ipfsStatus.startsWith('Pinning')
            }
            loadingText={ipfsStatus.startsWith('Pinning') ? ipfsStatus : status}
            disabled={
              !laboratory.length ||
              !bio.length ||
              status.startsWith('Waiting') ||
              status.startsWith('Pending') ||
              ipfsStatus.startsWith('Pinning')
            }
            onClick={() => changeProfile(1)}
            colorScheme='green'
            transition='0.3s '
            aria-label='submit button'
          >
            Submit
          </Button>
          <Button
            onClick={() => changeProfile(2)}
            ms='4'
            colorScheme='red'
            transition='0.3s '
            aria-label='cancel button'
          >
            Cancel
          </Button>
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default UserSetting
