import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs';
import {NextResponse} from 'next/server'

export async function middleware(req) {
    const res = NextResponse.next(); //placeholder
    const supabase = createMiddlewareClient({ req, res });
  
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Fetch user role from database
      const { data: userProfile, error } = await supabase
        .from('users') // Assuming your user profile table is named 'profiles'
        .select('role') // Only select the role field
        .eq('email', user.email) // Match the user by their ID
        .single();
  
      if (error || !userProfile) {
        console.error("Error fetching users :", error);
        return NextResponse.redirect(new URL('/', req.url));
      }
  
      const isAdmin = userProfile.role === 'admin';
  
      // Redirect non-admin users if they try to access /admin
      if (req.nextUrl.pathname === '/admin' && !isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } else {
      // Redirect non-logged-in users attempting to access restricted pages
      if (req.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  
    return res;
  }

export const config = {
  matcher: ['/', '/about', '/contest', '/login', '/myContest', '/updateUsers', '/createContestPage', '/admin'],
}