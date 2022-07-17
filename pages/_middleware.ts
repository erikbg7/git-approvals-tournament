import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/tournament')) {
    const isGitlabPathname = pathname.startsWith('/tournament/gitlab');
    const isGithubPathname = pathname.startsWith('/tournament/github');
    const isResultsPathname = pathname.startsWith('/tournament/results');

    if (!isGitlabPathname && !isGithubPathname && !isResultsPathname) {
      return NextResponse.rewrite(new URL('/', req.url));
    }
  }
  return NextResponse.next();
}
