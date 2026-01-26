"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axiosInstance from "@/lib/axiosInstance"
import { useParams } from "next/navigation"
import { toast } from 'react-toastify';
import { ApplyJobModalProps } from "@/types/job.interface"

export default function ApplyJobModal({ job, isOpen, onClose }: ApplyJobModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [proposedRate, setProposedRate] = useState(job?.payment?.toString())
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [portfolioLink, setPortfolioLink] = useState("")
  const params = useParams();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const applicationData = {
      jobId: params.id, 
      coverLetter,
      proposedRate: Number.parseFloat(proposedRate),
      estimatedDuration,
      portfolioLink,
    }
    // Submit via Axios instance
    await axiosInstance.post(`blockchain/jobs/${params.id}/apply`, applicationData)
    toast.success("Application submitted successfully");
    // Close the modal and reset form
    onClose()
    setCoverLetter("")
    setProposedRate(job?.payment?.toString())
    setEstimatedDuration("")
    setPortfolioLink("")
  } catch (error:any) {
    toast.error(error.response.data.message || "Failed to submit application")
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for: {job.title}</DialogTitle>
          <DialogDescription>
            Submit your application for this job. Make sure to highlight your relevant experience and skills.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Introduce yourself and explain why you're a good fit for this job..."
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Explain your relevant experience and why you're interested in this project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proposedRate">Your Bid (ETH)</Label>
              <Input
                id="proposedRate"
                type="number"
                step="0.0001"
                min="0"
                value={proposedRate}
                onChange={(e) => setProposedRate(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Client's budget: {job.budget} ETH</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <Select value={estimatedDuration} onValueChange={setEstimatedDuration} required>
                <SelectTrigger id="estimatedDuration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-week">Less than a week</SelectItem>
                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                  <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                  <SelectItem value="1-3-months">1-3 months</SelectItem>
                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Client's expectation: {job.duration}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioLink">Portfolio or Work Samples (Optional)</Label>
            <Input
              id="portfolioLink"
              type="url"
              placeholder="https://your-portfolio.com or GitHub repository"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Share relevant work samples or your portfolio website.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="termsAgreement" className="h-4 w-4 rounded border-gray-300" required />
              <Label htmlFor="termsAgreement" className="text-sm font-normal">
                I understand that my wallet will be used for payment transactions if hired.
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

