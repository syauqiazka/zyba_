"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";

declare global {
  interface Window {
    snap?: {
      pay: (
        snapToken: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

type PlanId = "monthly";

interface Plan {
  id: PlanId;
  label: string;
  price: number;
  period: string;
  sub: string;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    label: "Bulanan",
    price: 49_000,
    period: "/ bulan",
    sub: "Fleksibel, batalkan kapan saja",
  },
];
