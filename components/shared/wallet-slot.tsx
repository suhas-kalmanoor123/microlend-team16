"use client";

import { Wallet } from "lucide-react";

type Props = {
  connected: boolean;
  onConnectedChange: (connected: boolean) => void;
};

// PLACEHOLDER. A real wallet component replaces this later.
export function WalletSlot({ connected, onConnectedChange }: Props) {
  return (
    <div>
      {connected ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            0x71A...92F
          </span>
          <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            Ethereum Sepolia
          </span>
          <button
            type="button"
            onClick={() => onConnectedChange(false)}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onConnectedChange(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-foreground/5"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </button>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Your wallet is used to sign the blockchain record for this demo.
      </p>
    </div>
  );
}