import { intl } from '@/config';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(intl.defaultLocale);
}
