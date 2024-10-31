import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs';
import {NextResponse} from 'next/server'

export async function middleware(req) {
    const res = NextResponse.next(); //placeholder
    const supabase = createMiddlewareClient({ req, res });
  
    const { data: { user } } = await supabase.auth.getUser();
  
    if (user) {
      // Handle logged-in users (redirect to watch-list if on home)
      if (req.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } else {
    //   // Handle non-logged-in users (redirect to home for other pages except about)
    //   if (req.nextUrl.pathname == '/about' ) {
    //     return NextResponse.redirect(new URL('/about', req.url));
    //   }

    //   if (req.nextUrl.pathname == '/' ) {
    //     return NextResponse.redirect(new URL('/', req.url));
    //   }
    }
  
    return res;
  }

export const config = {
    matcher: ['/', '/about,/contest,/login/myContest/updateUsers/createContestPage']//if got more pages update here
}