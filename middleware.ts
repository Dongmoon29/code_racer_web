//  import { NextRequest, NextResponse } from 'next/server';
//  const protectedRoutes = ['/games']; // 보호 경로 설정
//
//  export function middleware(req: NextRequest) {
//    const token = req.cookies.get('token'); // JWT 토큰 체크
//    const pathname = req.nextUrl.pathname || '/'; // 빈 경로 기본값 설정
//
// //   // 보호 경로 체크
//    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
//      return NextResponse.redirect(new URL('/signin', req.url)); // 로그인 페이지로 이동
//    }
//
//    return NextResponse.next(); // 정상 요청 통과
//  }
//
//  // 미들웨어 적용할 경로 설정
//  export const config = {
//    matcher: ['/games/:path*'], // '/games' 경로 하위 모든 페이지에 적용
// };
