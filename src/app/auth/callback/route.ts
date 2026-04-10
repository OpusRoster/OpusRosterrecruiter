import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("users").select("org_id").eq("id", user.id).single();
        if (!profile?.org_id) return NextResponse.redirect(`${origin}/onboarding/company`);
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }
  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
}
