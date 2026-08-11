import { describe, it, expect, afterAll } from "vitest";

/**
 * A real write, read, approve, and delete cycle against the live database.
 *
 * The mocked tests prove the code intends to store approved = false. This
 * proves the row actually lands that way, that the public read genuinely
 * filters it out, and that approving makes it visible — end to end, through
 * the real schema.
 *
 * Everything written here is prefixed and removed afterwards.
 */

const hasCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const describeDb = hasCredentials ? describe : describe.skip;

const MARKER = "ZZ integration test comment";
const SLUG = "zz-integration-test-post";

async function purge() {
  if (!hasCredentials) return;
  const { supabaseAdmin } = await import("@/app/lib/supabaseAdmin");
  await supabaseAdmin.from("comments").delete().eq("post_slug", SLUG);
}

afterAll(purge);

describeDb("comment lifecycle against the real database", () => {
  it("stores a submission as unapproved and hides it from the public read", async () => {
    await purge();

    const { addComment, getApprovedComments, getAllComments } = await import(
      "@/app/lib/commentsStore"
    );

    const created = await addComment({
      postSlug: SLUG,
      authorName: "ZZ Integration",
      content: MARKER,
      ipHash: "f".repeat(64),
    });

    expect(created.approved).toBe(false);

    // The guarantee that matters: not visible publicly.
    const publicView = await getApprovedComments(SLUG);
    expect(publicView.some((c) => c.content === MARKER)).toBe(false);

    // But visible to an admin, as pending.
    const adminView = await getAllComments();
    const found = adminView.find((c) => c.id === created.id);
    expect(found).toBeTruthy();
    expect(found!.approved).toBe(false);
  });

  it("becomes publicly visible only after approval, and hides again when unapproved", async () => {
    const { addComment, setCommentApproval, getApprovedComments } = await import(
      "@/app/lib/commentsStore"
    );

    const created = await addComment({
      postSlug: SLUG,
      authorName: "ZZ Integration",
      content: MARKER,
    });

    await setCommentApproval(created.id, true);
    const afterApprove = await getApprovedComments(SLUG);
    expect(afterApprove.some((c) => c.id === created.id)).toBe(true);

    await setCommentApproval(created.id, false);
    const afterUnapprove = await getApprovedComments(SLUG);
    expect(afterUnapprove.some((c) => c.id === created.id)).toBe(false);
  });

  it("never exposes the rate-limiting ip hash to callers", async () => {
    const { addComment, getAllComments } = await import("@/app/lib/commentsStore");

    const created = await addComment({
      postSlug: SLUG,
      authorName: "ZZ Integration",
      content: MARKER,
      ipHash: "a".repeat(64),
    });

    const all = await getAllComments();
    const found = all.find((c) => c.id === created.id)!;

    expect(found).not.toHaveProperty("ipHash");
    expect(JSON.stringify(found)).not.toContain("a".repeat(64));
  });

  it("deletes cleanly", async () => {
    const { addComment, deleteComment, getAllComments } = await import(
      "@/app/lib/commentsStore"
    );

    const created = await addComment({
      postSlug: SLUG,
      authorName: "ZZ Integration",
      content: MARKER,
    });
    await deleteComment(created.id);

    const all = await getAllComments();
    expect(all.some((c) => c.id === created.id)).toBe(false);
  });

  it("leaves no test rows behind", async () => {
    await purge();
    const { supabaseAdmin } = await import("@/app/lib/supabaseAdmin");
    const { count } = await supabaseAdmin
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("post_slug", SLUG);

    expect(count ?? 0).toBe(0);
  });
});
