export { default } from 'next-auth/middleware';

export const config = {
  // api/auth 以外のすべてのルートを保護
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
