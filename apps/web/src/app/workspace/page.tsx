import { redirect } from 'next/navigation';
import { WORKSPACE_NAV_ITEMS } from '@/modules/workspace';

export default function WorkspacePage() {
  redirect(WORKSPACE_NAV_ITEMS[0].href);
}
