import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(req: NextRequest) {
    // Optional custom logic
  },
  {
    publicPaths: ['/', '/api/auth/*'],
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};