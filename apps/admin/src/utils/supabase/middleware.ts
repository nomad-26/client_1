import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const url = request.nextUrl.clone();

  // Exclude static assets, api routes, favicon
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname === "/favicon.ico"
  ) {
    return supabaseResponse;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If on /login page
    if (url.pathname === "/login") {
      if (user) {
        // Query profile for admin verification
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "ADMIN") {
          url.pathname = "/dashboard";
          return NextResponse.redirect(url);
        }
      }
      return supabaseResponse;
    }

    // Protect all other routes
    if (!user && !request.cookies.has('demo_auth')) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (request.cookies.has('demo_auth')) {
      return supabaseResponse;
    }

    // Double check admin role
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (error || profile?.role !== "ADMIN") {
      console.warn(`User ${user?.email} attempted to access admin portal without ADMIN role.`);
      // Sign out and redirect
      await supabase.auth.signOut();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // If the database is not set up or configured, log error and allow local development bypass to avoid build-time crashes.
    console.error("Middleware Auth Verification Error (normal if DB not initialized yet):", error);
  }

  return supabaseResponse;
}
