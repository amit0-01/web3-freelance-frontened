"use client"; // 👈 Required for client-side components

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDetails } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";

export default function WalletBalanceCard() {
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      try {
        // Get user details from storage
        const user = getUserDetails();
        const walletAddress = user?.walletAddress; // Ensure walletAddress exists

        if (!walletAddress) {
          setWalletBalance("N/A");
          setLoading(false);
          return;
        }

        // Fetch wallet balance from API
        const res = await axiosInstance.get(`/blockchain/balance/${walletAddress}`);

        setWalletBalance(parseFloat(res.data.balance).toFixed(4)); 
      } catch (error) {
        console.error("Error fetching balance:", error);
        setWalletBalance("Error");
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription>Your current balance</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <div>Loading...</div> : <div className="text-3xl font-bold">{walletBalance} ETH</div>}
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/wallet">
          <Button variant="ghost" className="h-8 px-2 text-sm">
            Manage
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
