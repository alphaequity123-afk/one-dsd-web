import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HomePageCopySchema, STATIC_HOME_COPY } from "@/lib/content/page-copy-contract";

const root = path.resolve(__dirname, "..");
const migration = readFileSync(
  path.join(root, "db", "migrations", "0058_pac_optional_home_headline_line.sql"),
  "utf8",
);

describe("optional third Home headline line migration", () => {
  it("matches the application contract, which accepts the current name without a third headline line", () => {
    expect(STATIC_HOME_COPY.headlineLine3).toBe("");
    expect(HomePageCopySchema.safeParse(STATIC_HOME_COPY).success).toBe(true);
    expect(HomePageCopySchema.safeParse({ ...STATIC_HOME_COPY, headlineLine1: "" }).success).toBe(false);
  });

  it("permits only an exactly blank Home heroNote or headlineLine3 before the ordinary checks", () => {
    const blankException = migration.indexOf("and candidate_key in ('heroNote', 'headlineLine3')");
    const lengthCheck = migration.indexOf("if length(btrim(candidate_value)) not between 1 and maximum_length then");
    const plainTextCheck = migration.indexOf("perform pac.assert_plain_page_text(candidate_value)");

    expect(migration).toContain("create or replace function pac.assert_valid_page_block_copy");
    expect(migration).toMatch(
      /requested_content_item_id = 'page-home'\s+and candidate_key in \('heroNote', 'headlineLine3'\)\s+and candidate_value = '' then\s+continue;/,
    );
    expect(migration.match(/\bcontinue;/g)).toHaveLength(1);
    expect(blankException).toBeGreaterThan(-1);
    expect(blankException).toBeLessThan(lengthCheck);
    expect(lengthCheck).toBeLessThan(plainTextCheck);
    expect(migration).toContain("perform pac.assert_safe_page_link(candidate_value)");
  });

  it("keeps every Home and footer field present and required to be text", () => {
    expect(migration).toContain("'heroKicker', 'headlineLine1', 'headlineLine2', 'headlineLine3'");
    expect(migration).toContain("requested_content_item_id = 'site-footer'");
    expect(migration).toContain("where not requested_copy ? expected.name");
    expect(migration).toContain("where actual.name <> all(expected_keys)");
    expect(migration).toContain("jsonb_typeof(requested_copy -> candidate_key) <> 'string'");
  });

  it("changes validation only and never writes, publishes, or rewrites earlier content", () => {
    expect(migration).toMatch(/^begin;[\s\S]*commit;\s*$/);
    expect(migration).not.toMatch(/\b(?:insert\s+into|update|delete\s+from|truncate|alter\s+table|drop)\b/i);
    expect(migration).not.toContain("publication_decisions");
    expect(migration).not.toContain("content_revisions");
  });
});
