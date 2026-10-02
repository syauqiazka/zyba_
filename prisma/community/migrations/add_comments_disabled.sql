-- Migration: add_comments_disabled_and_updatedAt
-- Run this SQL on the community database when available
-- Generated: 2026-10-02

-- Add commentsDisabled column (default false, so existing rows get false)
ALTER TABLE community_posts
  ADD COLUMN IF NOT EXISTS "commentsDisabled" BOOLEAN NOT NULL DEFAULT false;

-- Add updatedAt column with current timestamp as default
ALTER TABLE community_posts
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create a trigger to auto-update updatedAt on row update
CREATE OR REPLACE FUNCTION update_community_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS community_posts_updated_at_trigger ON community_posts;
CREATE TRIGGER community_posts_updated_at_trigger
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_community_posts_updated_at();
