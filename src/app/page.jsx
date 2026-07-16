import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const customerToken = cookieStore.get('customer_token');

  if (customerToken) {
    redirect('/customer/dashboard');
  } else {
    redirect('/customer/login');
  }
}
