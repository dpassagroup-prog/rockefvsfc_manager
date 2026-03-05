import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const getUser = async () => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();
  if (!isAuthed) return null;
  const user = await getUser();
  return user;
};