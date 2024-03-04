import createMiddleware from 'next-intl/middleware';
import { intl } from './config';

export default createMiddleware(intl);

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|assets|.*\\..*).*)'],
};
