"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardNav from "@/components/dashboard-nav"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/lib/axiosInstance"
import { Textarea } from "@/components/ui/textarea"

export default function PostJobPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const jobData = {
        title: formData.get("title"),
        payment: parseFloat(formData.get("payment") as string),
        deadline: formData.get("deadline"),
        description: formData.get("description"),
        duration: formData.get("duration"),
        category: (formData.get("category") as string).split(",").map(item => item.trim()),
        deliverables: (formData.get("deliverables") as string).split(",").map(item => item.trim()),
      }

      await axiosInstance.post("/blockchain/jobs", jobData)

      toast({ title: "Job posted successfully", description: "Your job is now visible." })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Failed to post job",
        description: error?.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Post a New Job</h1>
          <p className="text-muted-foreground mb-6">Create a job listing to hire freelancers.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" placeholder="e.g. Smart Contract Developer" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Budget (ETH)</Label>
                <Input id="payment" name="payment" type="number" step="0.00001" min="0" placeholder="0.00001" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" name="deadline" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea id="description" name="description" rows={5} placeholder="Detailed job description..." required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input id="duration" name="duration" placeholder="e.g. 2-4 weeks" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category (comma-separated)</Label>
                <Input id="category" name="category" placeholder="e.g. Development, Web3, Solidity" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables (comma-separated)</Label>
                <Input id="deliverables" name="deliverables" placeholder="e.g. Smart contract, Deployment guide, Docs" required />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
