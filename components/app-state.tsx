"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type {
  BorrowerProfile,
  FeasibilityResult,
  LenderMatch,
  Loan,
  LoanRequest,
} from "@/lib/types";

const STORAGE_KEY = "microlend:app-state";

type PersistedState = {
  borrower: BorrowerProfile | null;
  loanRequest: LoanRequest | null;
  feasibility: FeasibilityResult | null;
  matches: LenderMatch[] | null;
  acceptedLoan: Loan | null;
};

type AppStateValue = PersistedState & {
  hydrated: boolean;
  setBorrower: (borrower: BorrowerProfile) => void;
  setAssessment: (request: LoanRequest, result: FeasibilityResult) => void;
  setMatches: (matches: LenderMatch[]) => void;
  setAcceptedLoan: (loan: Loan) => void;
  reset: () => void;
};

const emptyState: PersistedState = {
  borrower: null,
  loanRequest: null,
  feasibility: null,
  matches: null,
  acceptedLoan: null,
};

let currentState: PersistedState | null = null;
const listeners = new Set<() => void>();

function readStoredState(): PersistedState {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    return { ...emptyState, ...(JSON.parse(raw) as Partial<PersistedState>) };
  } catch {
    return emptyState;
  }
}

function getSnapshot() {
  if (currentState === null) currentState = readStoredState();
  return currentState;
}

function getServerSnapshot() {
  return emptyState;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(updater: (prev: PersistedState) => PersistedState) {
  const next = updater(getSnapshot());
  if (next === currentState) return;
  currentState = next;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode, quota); state still works in memory.
  }
  listeners.forEach((listener) => listener());
}

const actions = {
  setBorrower: (borrower: BorrowerProfile) =>
    update((prev) => (prev.borrower?.id === borrower.id ? prev : { ...emptyState, borrower })),
  setAssessment: (loanRequest: LoanRequest, feasibility: FeasibilityResult) =>
    update((prev) => ({ ...prev, loanRequest, feasibility, matches: null, acceptedLoan: null })),
  setMatches: (matches: LenderMatch[]) => update((prev) => ({ ...prev, matches })),
  setAcceptedLoan: (acceptedLoan: Loan) => update((prev) => ({ ...prev, acceptedLoan })),
  reset: () => update(() => emptyState),
};

const noopSubscribe = () => () => {};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const value = useMemo<AppStateValue>(() => ({ ...state, hydrated, ...actions }), [state, hydrated]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}
