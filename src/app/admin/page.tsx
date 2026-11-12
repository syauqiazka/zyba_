import { redirect } from "next/navigation";

/**
 * ZYBA Admin Hub Gateway
 * Redirects to the active moderation console by default
 */
export default function AdminRootPage() {
  redirect("/admin/moderation");
}

