export const signIn = "/sign-in";
export const signUp = "/sign-up";
export const wardrobe = "/wardrobe";

export const authPaths = [signIn, signUp];

export const navHidden = [signIn, signUp];

export const unprotectedPaths = [signIn, signUp,];

export const unprotectedAPIPaths = [
  "/api/auth",
  "/api/username"
];

export function isNavHidden(pathname: string) {
  return navHidden.find((path) => pathname.startsWith(path));
}

export function isUnprotectedPath(pathname: string) {
  return !!unprotectedPaths.find((path) => pathname.startsWith(path));
}

export function isHiddenAuthenticatedPath(pathname: string) {
  return !!authPaths.find((path) => pathname.startsWith(path));
}

export function isProtectedAPIPath(pathname: string) {
  return !unprotectedAPIPaths.find((path) => pathname.startsWith(path));
}