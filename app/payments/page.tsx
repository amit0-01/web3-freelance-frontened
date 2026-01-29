"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardNav from "@/components/dashboard-nav"
import PaymentMethodModal from "@/components/payment-method-modal"
import { formatDate } from "@/lib/utils"
import { type Payment, getPayments, releasePayment } from "@/lib/payment"
import { toast } from "react-toastify"
import { loadRazorpay } from "@/lib/razorpay"


export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const loadPayments = async () => {
    try {
      const response = await getPayments(activeTab)
      if (response) {
        setPayments(response)
        setFilteredPayments([...response])
      }
    } catch (error) {
      toast.error("Failed to fetch payments")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()  
  }, [activeTab])

  useEffect(() => {
    // Filter payments based on active tab
    let filtered = [...payments]

    if (activeTab !== "all") {
      filtered = filtered.filter((payment) => payment.status === activeTab)
    }

    // Sort payments
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "highest":
        filtered.sort((a: any, b: any) => b.amount - a.amount)
        break
      case "lowest":
        filtered.sort((a: any, b: any) => a.amount - b.amount)
        break
    }

    setFilteredPayments(filtered)
  }, [payments, activeTab, sortBy])

  const openReleaseModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsPaymentMethodModalOpen(true)
  }


const handleConfirmRelease = async (paymentMethod: "blockchain" | "paypal") => {
  if (!selectedPayment) return

  setIsProcessing(true)

  try {
    // Blockchain flow (unchanged)
    if (paymentMethod === "blockchain") {
      const res = await releasePayment(
        selectedPayment.job.id,
        "blockchain",
        selectedPayment.id
      )

      if (res?.success) {
        toast.success("Blockchain payment released")
        setIsPaymentMethodModalOpen(false)
        loadPayments()
      }
      return
    }

    // ----------------------------
    // ✅ Razorpay Gateway Flow
    // ----------------------------

    const razorpayLoaded = await loadRazorpay()
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK failed to load")
      return
    }

    const res = await releasePayment(
      selectedPayment.job.id,
      "paypal", // gateway
      selectedPayment.id
    )

    if (!res?.success) {
      toast.error("Failed to initiate Razorpay payment")
      return
    }

    // 🔥 OPEN RAZORPAY MODAL
    const options = {
      key: res.keyId,
      amount: res.amount, // paise
      currency: res.currency,
      order_id: res.orderId,
      name: "Web3 Freelance Platform",
      description: "Release payment to freelancer",

      handler: function (response: any) {
        toast.success("Payment successful 🎉")
        setIsPaymentMethodModalOpen(false)

        // Payment confirmation will come via webhook
        setTimeout(() => loadPayments(), 2000)
      },

      modal: {
        ondismiss: () => {
          toast.info("Payment popup closed")
        },
      },

      theme: {
        color: "#6366f1",
      },
    }

    const razorpay = new (window as any).Razorpay(options)
    razorpay.open()

  } catch (error: any) {
    toast.error("Payment failed")
    console.error(error)
  } finally {
    setIsProcessing(false)
  }
}


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "ready_to_release":
        return <Badge variant="secondary">Ready to Release</Badge>
      case "released":
        return <Badge variant="default">Released</Badge>
      case "disputed":
        return <Badge variant="destructive">Disputed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* <DashboardNav /> */}
        <main className="flex-1 p-6 md:p-10">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <DashboardNav /> */}
      <main className="flex-1 p-6 md:p-10">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="text-muted-foreground">Manage your payments and transactions</p>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                  <div className="text-2xl font-bold">
                    {payments
                      .filter((p: any) => p.type === "incoming" && p.status === "released")
                      .reduce((sum, p: any) => sum + p.amount, 0)
                      .toFixed(2)}{" "}
                    ETH
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                  <div className="text-2xl font-bold">
                    {payments
                      .filter((p: any) => p.type === "outgoing" && p.status === "released")
                      .reduce((sum, p: any) => sum + p.amount, 0)
                      .toFixed(2)}{" "}
                    ETH
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Pending Payments</div>
                  <div className="text-2xl font-bold">{payments.filter((p) => p.status === "completed").length}</div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-3 space-y-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="ready_to_release">Ready to Release</TabsTrigger>
                  <TabsTrigger value="released">Released</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                  {filteredPayments.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">No payments found.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment: any) => (
                        <Card key={payment.id || Math.random()} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div
                                className={`w-1 md:w-2 flex-shrink-0 ${
                                  payment.type === "incoming" ? "bg-green-500" : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="p-6 flex-grow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold">
                                        <Link href={`/jobs/${payment.id || ""}`} className="hover:underline">
                                          {payment.job.title || "--"}
                                        </Link>
                                      </h3>
                                      {getStatusBadge(payment.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {payment.type === "incoming"
                                        ? "Payment from client"
                                        : `Payment to ${payment.freelancer?.name || "--"}`}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-lg">{payment.amount ?? 0} ETH</div>
                                    <div className="text-sm text-muted-foreground">
                                      Created: {formatDate(payment.createdAt || "")}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  {payment.transactionHash && (
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Tx: </span>
                                      <a
                                        href={`https://etherscan.io/tx/${payment.transactionHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        {payment.transactionHash.substring(0, 10)}...
                                        {payment.transactionHash.substring(payment.transactionHash.length - 8)}
                                      </a>
                                    </div>
                                  )}

                                  <div className="flex gap-2 md:ml-auto">
                                    <Link href={`/jobs/${payment.job?.id || ""}`}>
                                      <Button variant="outline" size="sm">
                                        View Job
                                      </Button>
                                    </Link>
                                   {payment.status.toLowerCase() != "released" &&
                                    <Button size="sm" onClick={() => openReleaseModal(payment)}>
                                      Release Payment
                                    </Button>
                                    }

                                    {payment.status === "pending" && payment.type === "outgoing" && (
                                      <Button size="sm" variant="outline" disabled>
                                        Awaiting Completion
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <PaymentMethodModal
        isOpen={isPaymentMethodModalOpen}
        paymentAmount={selectedPayment?.amount ?? 0}
        paymentTitle={selectedPayment?.job?.title || "Payment"}
        onSelectBlockchain={() => handleConfirmRelease("blockchain")}
        onSelectPayPal={() => handleConfirmRelease("paypal")}
        onCancel={() => {
          setIsPaymentMethodModalOpen(false)
          setSelectedPayment(null)
        }}
        isLoading={isProcessing}
      />
    </div>
  )
}
