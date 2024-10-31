import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next(); // Initialize response
  const supabase = createMiddlewareClient({ req, res });

  // Fetch the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("Auth Error:", authError);
  }

  if (user) {
    console.log("User logged in:", user.email); // Debugging

    // Fetch user role from the database
    const { data: userProfile, error: profileError } = await supabase
      .from('users') // Ensure this table name matches your Supabase setup
      .select('role') // Only select the role field
      .eq('email', user.email) // Match the user by their email
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return NextResponse.redirect(new URL('/', req.url));
    }

    console.log("User Profile:", userProfile); // Debugging

    const isAdmin = userProfile?.role === 'admin';

    // Redirect non-admin users trying to access /admin
    if (req.nextUrl.pathname === '/admin' && !isAdmin) {
      console.log("Non-admin user attempting to access admin page");
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    console.log("No user logged in");
    // Redirect non-logged-in users trying to access restricted pages
    if (req.nextUrl.pathname === '/admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/', '/about', '/contest', '/login', '/myContest', '/updateUsers', '/createContestPage', '/admin'],
};
