"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, CreditCard } from "lucide-react"
import { PaymentMethodModalProps } from "@/types/payment.interface"



export default function PaymentMethodModal({
  isOpen,
  paymentAmount,
  paymentTitle,
  onSelectBlockchain,
  onSelectPayPal,
  onCancel,
  isLoading = false,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"blockchain" | "paypal" | null>(null)

  const handleConfirm = () => {
    if (selectedMethod === "blockchain") {
      onSelectBlockchain()
    } else if (selectedMethod === "paypal") {
      onSelectPayPal()
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedMethod(null)
      onCancel()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose how you want to release the payment for{" "}
            <span className="font-semibold text-foreground">{paymentTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground">Amount to Release</div>
            <div className="text-3xl font-bold">{paymentAmount} ETH</div>
          </div>

          {/* Blockchain Payment Option */}
          <Card
            className={`p-4 cursor-pointer transition-all ${
              selectedMethod === "blockchain" ? "ring-2 ring-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedMethod("blockchain")}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Blockchain (Ethereum)</h3>
                  <Badge variant="outline" className="text-xs">
                    Recommended
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Fast, secure, and direct payment using smart contracts</p>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <div>✓ Instant settlement</div>
                  <div>✓ Low fees</div>
                  <div>✓ Transparent on-chain transaction</div>
                </div>
              </div>
              <input
                type="radio"
                name="payment-method"
                value="blockchain"
                checked={selectedMethod === "blockchain"}
                onChange={() => setSelectedMethod("blockchain")}
                className="mt-1 cursor-pointer"
              />
            </div>
          </Card>

          {/* PayPal Payment Option */}
          <Card
            className={`p-4 cursor-pointer transition-all ${
              selectedMethod === "paypal" ? "ring-2 ring-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedMethod("paypal")}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">PayPal Payment Gateway</h3>
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Release payment through PayPal for global accessibility</p>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <div>✓ Fiat currency support</div>
                  <div>✓ Buyer/seller protection</div>
                  <div>✓ Available worldwide</div>
                </div>
              </div>
              <input
                type="radio"
                name="payment-method"
                value="paypal"
                checked={selectedMethod === "paypal"}
                onChange={() => setSelectedMethod("paypal")}
                className="mt-1 cursor-pointer"
              />
            </div>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMethod(null)
              onCancel()
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedMethod || isLoading} className="gap-2">
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
