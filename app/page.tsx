"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getUserDetails } from "@/lib/utils"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
// import Chatbot from "@/components/chatbot"
import { motion } from "framer-motion"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const user = getUserDetails()
    setIsLoggedIn(!!user)
    setMounted(true)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  }

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  }

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen z-50">
        <Header />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Decentralized Job Marketplace
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Find work, hire talent, and make secure payments with our Web3-powered platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    alt="Hero"
                    className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                    src="https://images.pexels.com/photos/5905703/pexels-photo-5905703.jpeg"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
        {/* <Chatbot /> */}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                <div className="space-y-2">
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance"
                    variants={fadeInUp}
                  >
                    Decentralized Job Marketplace
                  </motion.h1>
                  <motion.p className="max-w-[600px] text-muted-foreground md:text-xl text-pretty" variants={fadeInUp}>
                    Find work, hire talent, and make secure payments with our Web3-powered platform.
                  </motion.p>
                </div>
                <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={fadeInUp}>
                  {isLoggedIn ? (
                    <Link href="/jobs">
                      <motion.div
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                          Browse Jobs
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                          >
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {isLoggedIn ? (
                    <Link href="/jobs/post">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant="outline"
                          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                          Post a Job
                        </Button>
                      </motion.div>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Post a Job
                    </Button>
                  )}
                </motion.div>
                {!isLoggedIn && (
                  <motion.p className="text-sm text-muted-foreground" variants={fadeInUp}>
                    Please{" "}
                    <Link href="/auth/login" className="underline hover:text-primary transition-colors">
                      login
                    </Link>{" "}
                    or{" "}
                    <Link href="/auth/register" className="underline hover:text-primary transition-colors">
                      register
                    </Link>{" "}
                    to access these features.
                  </motion.p>
                )}
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.img
                  alt="Hero"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center shadow-2xl"
                  src="https://images.pexels.com/photos/5905703/pexels-photo-5905703.jpeg"
                  whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform connects employers with talent in a secure, decentralized environment.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              <motion.div
                className="flex flex-col justify-center space-y-4 group"
                variants={{
                  initial: { opacity: 0, y: 60, scale: 0.9 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <span className="text-xl font-bold">1</span>
                </motion.div>
                <h3 className="text-xl font-bold">Post a Job</h3>
                <p className="text-muted-foreground">
                  Create a job listing with details about the work, budget, and requirements.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col justify-center space-y-4 group"
                variants={{
                  initial: { opacity: 0, y: 60, scale: 0.9 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <span className="text-xl font-bold">2</span>
                </motion.div>
                <h3 className="text-xl font-bold">Complete Work</h3>
                <p className="text-muted-foreground">Freelancers apply, get hired, and complete the required tasks.</p>
              </motion.div>

              <motion.div
                className="flex flex-col justify-center space-y-4 group"
                variants={{
                  initial: { opacity: 0, y: 60, scale: 0.9 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <span className="text-xl font-bold">3</span>
                </motion.div>
                <h3 className="text-xl font-bold">Secure Payment</h3>
                <p className="text-muted-foreground">
                  Once work is approved, payment is released automatically through smart contracts.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <motion.footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs text-muted-foreground">© 2025 Web3Jobs. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4 transition-all hover:text-primary">
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4 transition-all hover:text-primary"
          >
            Privacy
          </Link>
        </nav>
      </motion.footer>
      {/* <Chatbot /> */}
    </div>
  )
}
