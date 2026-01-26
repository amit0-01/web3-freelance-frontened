export interface PaymentMethodModalProps {
  isOpen: boolean
  paymentAmount: number
  paymentTitle: string
  onSelectBlockchain: () => void
  onSelectPayPal: () => void
  onCancel: () => void
  isLoading?: boolean
}