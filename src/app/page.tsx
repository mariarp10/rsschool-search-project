import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/characters?page=1');
}
