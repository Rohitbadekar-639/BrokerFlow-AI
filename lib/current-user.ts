import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function requireBrokerUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;
  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ").trim() || "Broker User";

  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        clerk_user_id: userId,
        email,
        full_name: fullName
      },
      { onConflict: "clerk_user_id" }
    )
    .select("id, clerk_user_id, email, full_name")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to load broker profile");
  }

  await supabaseAdmin
    .from("settings")
    .upsert({ user_id: data.id }, { onConflict: "user_id" });

  return data;
}
