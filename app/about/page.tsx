import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, Users, Zap, Lock, TrendingUp, ArrowRight, CheckCircle, Star } from "lucide-react"
import Header from "@/components/Header"

export default function AboutPage() {

  return (
    <div className="flex flex-col min-h-screen">
     <Header/>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Powered by Blockchain Technology
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  The Future of Freelancing
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Web3Jobs is revolutionizing the freelance economy with blockchain technology, smart contracts, and
                  decentralized payments. Join the next generation of work.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth/register">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="lg">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission</h2>
                  <p className="text-muted-foreground md:text-lg">
                    We believe in creating a fair, transparent, and efficient marketplace where talent meets opportunity
                    without traditional barriers.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Eliminate Intermediaries</h3>
                      <p className="text-sm text-muted-foreground">
                        Direct connections between clients and freelancers without platform fees eating into earnings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Secure Payments</h3>
                      <p className="text-sm text-muted-foreground">
                        Smart contracts ensure automatic, secure payments upon job completion.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Global Access</h3>
                      <p className="text-sm text-muted-foreground">
                        Borderless payments and opportunities accessible to anyone with an internet connection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Mission"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=400&width=600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Web3Jobs?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience the benefits of blockchain technology in freelancing
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Shield className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Secure & Transparent</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    All transactions are recorded on the blockchain, ensuring complete transparency and security for
                    both parties.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Zap className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Instant Payments</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Smart contracts automatically release payments upon job completion, eliminating payment delays.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Globe className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Global Marketplace</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Connect with talent and opportunities worldwide without geographical or currency barriers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Lock className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Decentralized</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    No single point of failure or control. The platform is owned and governed by its community.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Users className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Lower Fees</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Minimal platform fees compared to traditional freelancing platforms, keeping more money in your
                    pocket.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <TrendingUp className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Future-Proof</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Built on cutting-edge blockchain technology that evolves with the decentralized economy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple steps to get started with decentralized freelancing
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 lg:gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Connect Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your Web3 wallet to get started. We support all major wallets including MetaMask.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Find or Post Jobs</h3>
                <p className="text-muted-foreground">
                  Browse available jobs or post your own project. Set your terms and requirements.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Work & Deliver</h3>
                <p className="text-muted-foreground">
                  Collaborate through our platform and deliver high-quality work according to specifications.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold">Get Paid</h3>
                <p className="text-muted-foreground">
                  Receive instant payment in cryptocurrency once the work is approved and completed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="text-4xl font-bold">10K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="text-4xl font-bold">5K+</div>
                <div className="text-muted-foreground">Jobs Completed</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="text-4xl font-bold">$2M+</div>
                <div className="text-muted-foreground">Total Payments</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="text-4xl font-bold">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from freelancers and clients who are already part of the Web3 economy
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "Web3Jobs has revolutionized how I work as a freelancer. Instant payments and no platform fees mean
                    I keep more of what I earn."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <div>
                      <div className="font-medium">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Smart Contract Developer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "As a startup founder, Web3Jobs gives me access to global talent with transparent, secure payments.
                    It's the future of hiring."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <div>
                      <div className="font-medium">Alex Rodriguez</div>
                      <div className="text-sm text-muted-foreground">Startup Founder</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "The transparency and security of blockchain technology makes me feel confident in every
                    transaction. Highly recommended!"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <div>
                      <div className="font-medium">Emily Johnson</div>
                      <div className="text-sm text-muted-foreground">UI/UX Designer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Join the Future?</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start your journey in the decentralized economy today. Connect your wallet and discover opportunities.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth/register">
                  <Button size="lg">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="lg">
                    Explore Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 Web3Jobs. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
