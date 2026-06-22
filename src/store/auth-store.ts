"use client";

import { create } from "zustand";
import { uid } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// DEMO AUTH — client-side only.
// Accounts live in localStorage; passwords are SHA-256 hashed (never stored in
// plaintext) but this is NOT a substitute for real server-side auth. It exists
// so the login/register flows are fully functional in the v1 (no-backend) build.
// Swap these four actions for API calls against the `users` table in the schema
// doc when the backend lands — the UI won't change.
// ─────────────────────────────────────────────────────────────

const ACCOUNTS_KEY = "spaceai:accounts";
const SESSION_KEY = "spaceai:session";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

interface StoredAccount extends User {
  passHash: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthState {
  user: User | null;
  hydrated: boolean;
  hydrate: () => void;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

async function sha256(text: string): Promise<string> {
  // Web Crypto is available in browsers (https + localhost).
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readAccounts(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]") as StoredAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function toUser(a: StoredAccount): User {
  return { id: a.id, name: a.name, email: a.email, createdAt: a.createdAt };
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuth = create<AuthState>((set) => ({
  user: null,
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const account = readAccounts().find((a) => a.id === sessionId);
        if (account) {
          set({ user: toUser(account), hydrated: true });
          return;
        }
      }
    } catch {
      /* ignore */
    }
    set({ hydrated: true });
  },

  register: async (name, email, password) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2) return { ok: false, error: "Please enter your name." };
    if (!emailRe.test(cleanEmail)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

    const accounts = readAccounts();
    if (accounts.some((a) => a.email === cleanEmail)) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const account: StoredAccount = {
      id: uid("user"),
      name: cleanName,
      email: cleanEmail,
      createdAt: Date.now(),
      passHash: await sha256(password),
    };
    writeAccounts([...accounts, account]);
    localStorage.setItem(SESSION_KEY, account.id);
    set({ user: toUser(account) });
    return { ok: true };
  },

  login: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRe.test(cleanEmail)) return { ok: false, error: "Enter a valid email address." };

    const account = readAccounts().find((a) => a.email === cleanEmail);
    if (!account) return { ok: false, error: "No account found for that email." };
    if (account.passHash !== (await sha256(password))) {
      return { ok: false, error: "Incorrect password." };
    }
    localStorage.setItem(SESSION_KEY, account.id);
    set({ user: toUser(account) });
    return { ok: true };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null });
  },
}));
