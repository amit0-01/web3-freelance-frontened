// components/PostJobButton.tsx
'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserRole } from "@/lib/utils"

export default function PostJobButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const role = getUserRole()
    if (role === "CLIENT") {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <Link href="/jobs/post">
      <Button>Post a New Job</Button>
    </Link>
  )
}
