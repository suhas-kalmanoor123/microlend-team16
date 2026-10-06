"use client";

import { useState } from "react";
import { LoaderCircle, Wallet } from "lucide-react";
import { DEMO_MODE, NETWORK_NAME, connectWallet } from "@/lib/demo/chain";

type Props = {
  connected: boolean;
  onConnectedChange: (connected: boolean) => void;
};

const DEMO_ADDRESS = "0x71A9c4e2B7d1F0a3C5e8D6b2A4f1E7c3B9d092F";
const short = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export function WalletSlot({ connected, onConnectedChange }: Props) {
  const [address, setAddress] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setError(null);
    if (DEMO_MODE) {
      setAddress(DEMO_ADDRESS);
      onConnectedChange(true);
      return;
    }
    setBusy(true);
    try {
      const result = await connectWallet();
      setAddress(result.address);
      onConnectedChange(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(
        /reject|denied|cancel/i.test(message)
          ? "The connection request was rejected in your wallet."
          : "Could not connect. Make sure MetaMask is unlocked, then try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    onConnectedChange(false);
  };

  return (
    <div>
      {connected && address ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {short(address)}
          </span>
          <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            {NETWORK_NAME}
          </span>
          <button
            type="button"
            onClick={disconnect}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={connect}
          disabled={busy}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-foreground/5 disabled:opacity-60"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
          {DEMO_MODE ? "Continue in Demo Mode" : "Connect Wallet"}
        </button>
      )}
      {error && <p className="mt-2 text-xs text-amber-500">{error}</p>}
      <p className="mt-2 text-xs text-muted-foreground">
        {DEMO_MODE
          ? "No wallet detected, so transactions are simulated."
          : "Your wallet is used to sign the blockchain record for this demo."}
      </p>
    </div>
  );
}