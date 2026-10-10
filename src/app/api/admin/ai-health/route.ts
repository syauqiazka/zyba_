// src/app/api/admin/ai-health/route.ts
// Secure Admin Diagnostic Endpoint for AI Providers Health (SPEC TAHAP KETUJUH)

import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import { CentralAIRouter } from "@/backend/ai/router";

export async function GET(req: NextRequest) {
  try {
    // 1. Autentikasi sesi
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Otorisasi Admin
    const user = await accountDb.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // 3. Jalankan diagnostik kesehatan provider secara non-destruktif
    const diagnostics = await CentralAIRouter.runDiagnostics();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      providers: diagnostics,
      activeProviderCount: diagnostics.filter((d) => d.authenticated).length,
      configuredCount: diagnostics.filter((d) => d.configured).length,
    });
  } catch (err: any) {
    console.error("[AI Health Diagnostic Error]:", err);
    return NextResponse.json({ error: "Internal diagnostic error" }, { status: 500 });
  }
}
