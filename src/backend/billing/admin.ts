import { accountDb } from "@/backend/db/accountClient";
import { verifySessionToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session?.userId || !session.email) return null;

  const configured = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!configured.includes(session.email.toLowerCase())) return null;

  const user = await accountDb.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, plan: true },
  });

  return user || null;
}
