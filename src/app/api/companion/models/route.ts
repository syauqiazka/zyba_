// src/app/api/companion/models/route.ts
// Return AI models with live availability status and mode recommendations (AGENTS.md 19.4)

import { NextRequest, NextResponse } from "next/server";
import { MODEL_REGISTRY, getAvailableModels } from "@/backend/ai/modelRegistry";
import { verifySessionToken } from "@/lib/auth";
import { getUserPlan } from "@/backend/billing/entitlements";

export async function GET(req: NextRequest) {
  try {
    let plan: "FREE" | "PLUS" = "FREE";
    const token = req.cookies.get("auth-token")?.value;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        plan = await getUserPlan(session.userId);
      }
    }

    const availableList = getAvailableModels(plan);
    const availableIds = new Set(availableList.map((m) => m.id));

    // Return model list yang relevan dengan plan pengguna
    const models = MODEL_REGISTRY
      .filter((m) => m.tier === "ALL" || (m.tier === "PLUS" && plan === "PLUS"))
      .map((m) => ({
        id: m.id,
        provider: m.provider,
        label: m.label,
        description: m.description,
        badge: m.badge,
        icon: m.icon,
        tier: m.tier,
        recommendedModes: m.recommendedModes,
        isAvailable: availableIds.has(m.id),
      }));

    return NextResponse.json({
      models,
      plan,
      count: models.length,
      availableCount: availableList.length,
    });
  } catch (err) {
    console.error("[API /api/companion/models]:", err);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
