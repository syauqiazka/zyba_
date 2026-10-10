import { accountDb } from "@/backend/db/accountClient";
import { verifySessionToken } from "@/lib/auth";
import { userRepository } from "@/backend/auth/userRepository";
import { NextRequest } from "next/server";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  plan: "FREE" | "PLUS";
}

export async function requireAdmin(req: NextRequest): Promise<AdminUser | null> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session?.userId || !session.email) return null;

  // 1. Cek langsung role akun di database
  try {
    const user = await accountDb.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, plan: true, role: true },
    });

    if (user && user.role === "ADMIN") {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: "ADMIN",
        plan: (user.plan as any) || "PLUS",
      };
    }
  } catch (err: any) {
    console.warn("[requireAdmin] Database lookup error:", err?.message);
  }

  // 2. Cek apakah email terdaftar dalam konfigurasi ADMIN_EMAILS
  const configured = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (configured.includes(session.email.toLowerCase())) {
    try {
      const user = await accountDb.user.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true, name: true, plan: true, role: true },
      });
      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: "ADMIN",
          plan: (user.plan as any) || "PLUS",
        };
      }
    } catch {}

    return {
      id: session.userId,
      email: session.email,
      name: session.name || "Administrator",
      role: "ADMIN",
      plan: "PLUS",
    };
  }

  // 3. Fallback repository lokal
  try {
    const localUser = await userRepository.findById(session.userId);
    if (localUser && (localUser.role === "ADMIN" || configured.includes(localUser.email.toLowerCase()))) {
      return {
        id: localUser.id,
        email: localUser.email,
        name: localUser.name,
        role: "ADMIN",
        plan: localUser.plan || "PLUS",
      };
    }
  } catch {}

  return null;
}

