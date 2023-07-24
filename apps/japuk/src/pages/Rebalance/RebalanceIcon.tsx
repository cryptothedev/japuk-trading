import { IconButton } from '@chakra-ui/react'
import {
  FaBalanceScale,
  FaBalanceScaleLeft,
  FaBalanceScaleRight,
} from 'react-icons/fa'

const EXCEED_AMOUNT = 10

interface RebalanceIconProps {
  gain: number
  isRebalancing?: boolean
  onClick?: (...params: any) => any
}
export const RebalanceIcon = ({
  gain,
  onClick,
  isRebalancing,
}: RebalanceIconProps) => {
  const noNeedToRebalance = Math.abs(gain) < EXCEED_AMOUNT

  if (noNeedToRebalance) {
    return (
      <IconButton
        icon={<FaBalanceScale fontSize="1.25rem" />}
        variant="solid"
        colorScheme="neutral"
        aria-label="rebalance"
        onClick={onClick}
        isLoading={isRebalancing}
        isDisabled
      />
    )
  }

  if (gain > 0) {
    return (
      <IconButton
        icon={<FaBalanceScaleRight fontSize="1.25rem" />}
        variant="solid"
        colorScheme="danger"
        aria-label="rebalance"
        onClick={onClick}
        isLoading={isRebalancing}
      />
    )
  }

  return (
    <IconButton
      icon={<FaBalanceScaleLeft fontSize="1.25rem" />}
      variant="solid"
      colorScheme="primary"
      aria-label="rebalance"
      onClick={onClick}
      isLoading={isRebalancing}
    />
  )
}
