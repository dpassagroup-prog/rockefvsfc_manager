import { redirect } from 'next/navigation';

export async function GET() {
  // Redirect to Kinde logout
  const kindeDomain = process.env.KINDE_DOMAIN;
  const postLogoutRedirectUrl = process.env.KINDE_POST_LOGOUT_REDIRECT_URL;
  
  const logoutUrl = `https://${kindeDomain}/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUrl!)}`;
  
  redirect(logoutUrl);
}