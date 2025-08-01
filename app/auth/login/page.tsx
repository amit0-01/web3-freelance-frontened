"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/lib/axiosInstance"
import { storageService } from "@/lib/storageService"
import { ethers } from "ethers"
import Cookies from "js-cookie"; 
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axiosInstance.post("/auth/login", { email, password })

      const data = response.data
      console.log('data', data)
      if(data.success){
      const expiryTimestamp = Date.now() + 60 * 60 * 1000
      // const expiryTimestamp = Date.now() + 60 * 1000
      storageService.setItem("user", data)
      storageService.setItem('tokenExpiry', expiryTimestamp)
      Cookies.set("token", data.accessToken, { expires: 1 / 24, secure: true, sameSite: "Strict" });

      toast.success("Login successful")

      router.push("/dashboard")
      }
    } catch (error: any) {
      toast.error('Login Failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Web3 Authentication with MetaMask
  const handleWeb3Login = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not found")
      return
    }

    try {
      setIsLoading(true)

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const walletAddress = await signer.getAddress()

      // Sign a message for authentication
      const message = `Sign in with your wallet: ${walletAddress}`
      const signature = await signer.signMessage(message)

      // Send walletAddress and signature to backend for verification
      const response = await axiosInstance.post("/auth/web3-login", { walletAddress, signature })
      const data = response.data
      console.log('data', data)
      const expiryTimestamp = Date.now() + 60 * 60 * 1000
      storageService.setItem('tokenExpiry', expiryTimestamp)
      Cookies.set("token", data.accessToken, { expires: 1 / 24, secure: true, sameSite: "Strict" });

      storageService.setItem("user", data)

      toast.success("Login successful")

      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Web3 Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Enter your credentials or use Web3 authentication</p>
        </div>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-sm">OR</span>
          </div>

          <Button onClick={handleWeb3Login} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
            {isLoading ? "Connecting..." : "Login with MetaMask"}
          </Button>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/join" className="underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
