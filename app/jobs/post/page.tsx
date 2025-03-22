// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import DashboardNav from "@/components/dashboard-nav"
// import { useToast } from "@/hooks/use-toast"

// export default function PostJobPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       // Get form data
//       const formData = new FormData(e.target as HTMLFormElement)
//       const jobData = Object.fromEntries(formData.entries())

//       const response = await fetch("/api/jobs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(jobData),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to post job")
//       }

//       toast({
//         title: "Job posted successfully",
//         description: "Your job has been posted and is now visible to freelancers.",
//       })

//       router.push("/dashboard")
//     } catch (error) {
//       toast({
//         title: "Failed to post job",
//         description: "There was an error posting your job. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen flex-col">
//       <DashboardNav />
//       <main className="flex-1 p-6 md:p-10">
//         <div className="mx-auto max-w-3xl">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
//             <p className="text-muted-foreground">Create a new job listing to find the perfect talent</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Job Title</Label>
//                 <Input id="title" name="title" placeholder="e.g. Smart Contract Developer" required />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="category">Category</Label>
//                 <Select name="category" defaultValue="development">
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="development">Development</SelectItem>
//                     <SelectItem value="design">Design</SelectItem>
//                     <SelectItem value="marketing">Marketing</SelectItem>
//                     <SelectItem value="content">Content</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Job Description</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   placeholder="Describe the job in detail..."
//                   rows={6}
//                   required
//                 />
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="budget">Budget (ETH)</Label>
//                   <Input id="budget" name="budget" type="number" step="0.01" min="0" placeholder="0.00" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="duration">Duration</Label>
//                   <Select name="duration" defaultValue="1-2-weeks">
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="less-than-week">Less than a week</SelectItem>
//                       <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
//                       <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
//                       <SelectItem value="1-3-months">1-3 months</SelectItem>
//                       <SelectItem value="3-6-months">3-6 months</SelectItem>
//                       <SelectItem value="more-than-6-months">More than 6 months</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="requirements">Requirements</Label>
//                 <Textarea
//                   id="requirements"
//                   name="requirements"
//                   placeholder="List the skills and experience required..."
//                   rows={4}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="deliverables">Deliverables</Label>
//                 <Textarea
//                   id="deliverables"
//                   name="deliverables"
//                   placeholder="List the expected deliverables..."
//                   rows={4}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="deadline">Application Deadline</Label>
//                 <Input id="deadline" name="deadline" type="date" required />
//               </div>
//             </div>

//             <div className="flex justify-end gap-4">
//               <Button type="button" variant="outline" onClick={() => router.back()}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading ? "Posting..." : "Post Job"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }



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
      }

      await axiosInstance.post("/blockchain/jobs", jobData)

      toast({ title: "Job posted successfully", description: "Your job is now visible." })
      router.push("/dashboard")
    } catch (error:any) {
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
