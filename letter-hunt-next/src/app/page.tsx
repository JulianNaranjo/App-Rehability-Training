import { redirect } from 'next/navigation';

/**
 * Home Page - Redirects to Dashboard
 *
 * The root route / redirects to /dashboard for better UX.
 *
 * @module HomePage
 */

export default function Home() {
  redirect('/dashboard');
}
