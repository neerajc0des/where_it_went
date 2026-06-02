import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request: NextRequest){
    const {pathname} = request.nextUrl;

    // getting token from cookies as middleware runs on serverside 
    const token = request.cookies.get('accessToken')?.value;
    const isAuth = !!token;

    const isPublicRoute = publicRoutes.some(route=>pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route=>pathname.startsWith(route));

    // redirecting logged in user from reg or login page 
    if(isAuth && isAuthRoute){
        return NextResponse.redirect(new URL('/overview', request.url));
    }

    // redirecting not logged in user to login page
    if(!isAuth && !isPublicRoute){
        const loginUrl = new URL('/login', request.url);
        // saving the path they were trying
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    // match all routes except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};