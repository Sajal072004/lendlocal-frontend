import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Users, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 xl:py-40 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Borrow, Don&apos;t Buy.
                <br />
                <span className="text-primary">Share with Your Community.</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                LendLocal connects you with your neighbors to borrow items you need and lend out things you&apos;re not using. Save money, reduce waste, and build a stronger community.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
            <Image
              src="/hero-image.jpg"
              width={600}
              height={400}
              alt="Hero Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why You&apos;ll Love LendLocal</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We&apos;ve built a platform that makes sharing simple, safe, and rewarding.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="grid gap-1 text-center">
                <Share2 className="h-10 w-10 mx-auto text-primary"/>
                <h3 className="text-xl font-bold">Share Anything</h3>
                <p className="text-muted-foreground">From power tools to party supplies, easily list your items for others to borrow.</p>
            </div>
            <div className="grid gap-1 text-center">
                <Users className="h-10 w-10 mx-auto text-primary"/>
                <h3 className="text-xl font-bold">Build Community</h3>
                <p className="text-muted-foreground">Create or join private communities with people you trust, like neighbors or colleagues.</p>
            </div>
            <div className="grid gap-1 text-center">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary"/>
                <h3 className="text-xl font-bold">Safe & Secure</h3>
                <p className="text-muted-foreground">With user reviews and a robust reporting system, you can share with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 lg:py-28 bg-muted/40">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works in 3 Easy Steps</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Getting started with LendLocal is simple and intuitive.
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">1</div>
                <h3 className="text-xl font-semibold">Find an Item</h3>
                <p className="text-muted-foreground">Search for an item you need in your local community.</p>
            </div>
             <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">2</div>
                <h3 className="text-xl font-semibold">Request to Borrow</h3>
                <p className="text-muted-foreground">Send a request to the owner and coordinate a pickup time.</p>
            </div>
             <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">3</div>
                <h3 className="text-xl font-semibold">Share & Return</h3>
                <p className="text-muted-foreground">Use the item, return it on time, and leave a review!</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-6 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">&copy; 2024 LendLocal. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Built by Sajal Namdeo</p>
        </div>
      </footer>
    </div>
  );
}
