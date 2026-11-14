import { redirect } from 'next/navigation';
import { SYSTEM_NAV_ITEMS, getFirstNavHref } from '@/modules/system';

export default function SystemPage() {
  redirect(getFirstNavHref(SYSTEM_NAV_ITEMS) ?? '/system');
}
