import { useContext } from "react"
import { GovernanceContext } from "../contexts/GovernanceContext"

// -----------------------------------------------------HOOK
export const useGovernanceContract = () => {
  // call the context with global state
  const [governance] = useContext(GovernanceContext)

  // control call of the hook
  if (governance === undefined) {
    throw new Error(
      `It seems that you are trying to use GovernanceContext outside of its provider`
    )
  }

  // first: return contract for utilisation
  return {
    governance
  }
}
