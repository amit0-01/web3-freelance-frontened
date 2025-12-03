"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardNav from "@/components/dashboard-nav"
import { Profile } from "../types/profile.types"
import { checkRazorPayStatus, connectToRazorPay, getUserProfile, updateProfile } from "@/services/profile.service"
import { toast } from 'react-toastify';


export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRozorpayAccountConnected, setIsrozorpayAccountConnected] = useState(false);

  const handleConnectRazorpay = async () => {
    try {
      const response = await connectToRazorPay();
      if(response.data && response.data.success){
      
      }
      // Redirect freelancer to Razorpay onboarding page
      // window.location.href = data.onboardingUrl;
    } catch (err) {
      toast.error('Failed to start Razorpay onboarding')
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile()
      console.log('response', response)
      if(response.status == 200){
      setProfile(response.data.data.user);
    }
    } catch (error) {
      toast.error('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRazorPayStatus = async () =>{
    try {
      const response  = await checkRazorPayStatus()
      if(response.status == 200 && response.data.connected){
        setIsrozorpayAccountConnected(true);
      }
    } catch (error) {
      toast.error('Error getting status')
    }
  }
  

  useEffect(() => {
    fetchRazorPayStatus();
    fetchProfile()
  }, [toast])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const updatedProfile = Object.fromEntries(formData.entries())

      const response = await updateProfile(updatedProfile)
      if(response.data.statusCode == 200){
        toast.success('Your profile has been updated successfully')
      }
      console.log('update profile repsonse ', response)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNav />
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
      <DashboardNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Profile</h1>

          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="wallet">Wallet & Payments</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <form onSubmit={handleProfileUpdate}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and public profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={profile?.name} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={profile?.email} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" defaultValue={profile?.bio} rows={4} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input id="skills" name="skills" defaultValue={profile?.skills?.join(", ")} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="websiteLink">Website</Label>
                    <Input id="websiteLink" name="websiteLink" defaultValue={profile?.websiteLink} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubLink">GitHub</Label>
                    <Input id="githubLink" name="githubLink" defaultValue={profile?.githubLink} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterLink">Twitter</Label>
                    <Input id="twitterLink" name="twitterLink" defaultValue={profile?.twitterLink} />
                  </div>
                  </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet & Payments</CardTitle>
                  <CardDescription>Manage your wallet address and payment settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input id="walletAddress" defaultValue={profile?.walletAddress} readOnly />
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Connected Wallet</h3>
                        <p className="text-sm text-muted-foreground">Your wallet is connected and ready to use</p>
                      </div>
                      <Button variant="outline">Disconnect</Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Razorpay Payouts</h3>

                  {profile?.razorpayAccountId ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Razorpay account connected: <strong>{profile.razorpayAccountId}</strong>
                      </p>
                      <Button variant="outline" onClick={() => window.open("https://dashboard.razorpay.com/", "_blank")}>
                        View Razorpay Dashboard
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect your Razorpay account to receive payouts directly to your bank.
                      </p>
                      <Button onClick={handleConnectRazorpay}>
                        Connect Razorpay Account
                      </Button>
                    </div>
                  )}
                </div>


                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Payment History</h3>
                    <p className="text-sm text-muted-foreground">No payment history available</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

