'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'


export default function JoinPage() {
  const [role, setRole] = useState<"CLIENT" | "FREELANCER">("CLIENT")
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-white">
      <h1 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
        Join as a client or freelancer
      </h1>

      <div className="flex gap-4 mb-8">
        <Card
          onClick={() => setRole("CLIENT")}
          className={cn(
            "w-72 cursor-pointer transition-all",
            role === "CLIENT" && "border-2 border-green-600"
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">👤</span>
              <div
                className={cn(
                  "w-4 h-4 border-2 rounded-full",
                  role === "CLIENT" ? "border-green-600 bg-green-600" : "border-gray-300"
                )}
              />
            </div>
            <p className="text-lg font-medium">
              I'm a client, hiring for a project
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setRole("FREELANCER")}
          className={cn(
            "w-72 cursor-pointer transition-all",
            role === "FREELANCER" && "border-2 border-green-600"
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧑‍💻</span>
              <div
                className={cn(
                  "w-4 h-4 border-2 rounded-full",
                  role === "FREELANCER" ? "border-green-600 bg-green-600" : "border-gray-300"
                )}
              />
            </div>
            <p className="text-lg font-medium">
              I'm a freelancer, looking for work
            </p>
          </CardContent>
        </Card>
      </div>

      <Button
    className="bg-green-600 hover:bg-green-700 text-white mb-4"
    onClick={() => router.push(`/auth/register?role=${role}`)}
    >
    Join as a {role === "CLIENT" ? "CLIENT" : "Freelancer"}
    </Button>

      <p className="text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-green-600 underline">
          Log In
        </a>
      </p>
    </div>
  )
}
