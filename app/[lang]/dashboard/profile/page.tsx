import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function ProfileRedirect() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Redirect to the user's profile page with their ID
  redirect(`/dashboard/profile/${user.id}`);
}
