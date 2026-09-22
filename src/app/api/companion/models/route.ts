/**
 * GET /api/companion/models
 * Return available AI models based on configured API keys
 * SPEC: AGENTS.md 19.4
 */
import { NextResponse } from "next/server";
import { getAvailableModels } from "@/backend/ai/modelRegistry";

export async function GET() {
  try {
    const models = getAvailableModels();
    
    return NextResponse.json({
      models: models.map(m => ({
        id: m.id,
        provider: m.provider,
        label: m.label,
        description: m.description,
      })),
      count: models.length,
    });
  } catch (err) {
    console.error("[API /api/companion/models]:", err);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
