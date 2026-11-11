import { redirect } from "next/navigation";

/**
 * ZYBA Canonical Route Redirection
 * Sesuai AGENTS.md (8.5.1 & 28): daily-assessment disatukan ke /mood-check-in
 */
export default function DailyAssessmentRedirectPage() {
  redirect("/mood-check-in");
}
