import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { isAdmin, isUserAuthenticated, sendAPIResponse } from './utils';
import { routes } from './constant';

const protectedAPIRoutes: {
  path: RegExp;
}[] = [
  {
    path: /^\/api\/v1\/shiksha(?:\/|$)/,
  },
];

const protectedUIRoutes: {
  path: RegExp;
}[] = [
  {
    path: /^\/shiksha\/(?:\/|$)/,
  },
];

const middleware = async (req: NextRequest) => {
  // console.log('path matched : ', req.url);

  const currentUrl = req.nextUrl.pathname;

  const isProtectedAPIRoute = protectedAPIRoutes.find((route) =>
    route.path.test(currentUrl)
  );

  if (isProtectedAPIRoute) {
    const adminHeader = req.headers.get('x-admin-secret') || '';

    if (!isAdmin(adminHeader) && req.method !== 'GET') {
      return NextResponse.json(
        sendAPIResponse({
          status: false,
          message: 'Unauthorized',
        })
      );
    }
  }

  const isAuthenticated = await isUserAuthenticated(req);

  if (!isAuthenticated) {
    const isProtectedUIRoute = protectedUIRoutes.find((route) =>
      route.path.test(currentUrl)
    );

    if (isProtectedUIRoute) {
      return NextResponse.redirect(new URL(routes.register, req.url));
    }
  } else {
    return NextResponse.next();
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/register', '/shiksha/:courseSlug*', '/api/v1/course/:courseId*'],
};

export { middleware };
