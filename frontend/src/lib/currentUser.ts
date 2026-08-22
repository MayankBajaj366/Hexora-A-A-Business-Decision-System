import { auth } from "@/auth";

/** Returns the signed-in user's database id, or null if not logged in. */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  return id ?? null;
}
