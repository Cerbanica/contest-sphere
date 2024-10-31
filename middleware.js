import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Retrieve the session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  // Log session and errors for debugging
  console.log("Session:", session);
  console.error("Session Error:", sessionError);

  if (session) {
    // Fetch the user's role
    const { data: userProfile, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single();

    // Log user role and errors for debugging
    console.log("User Role:", userProfile?.role);
    console.error("Role Fetch Error:", roleError);

    // Redirect non-admins trying to access /admin
    if (req.nextUrl.pathname === '/admin' && userProfile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    // Redirect unauthenticated users to login for protected routes
    if (req.nextUrl.pathname === '/admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin', '/myContest', '/updateUsers', '/createContestPage','/login','/'], // List protected routes here
};
