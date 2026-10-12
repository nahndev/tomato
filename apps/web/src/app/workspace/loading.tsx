import { Spinner } from '@tomato/ui';

export default function WorkspaceLoading() {
  return (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
