import { RoleStatus } from "@tomato/constants";
import { Badge } from "@tomato/ui";

export function RoleStatusBadge({ status }: { status: RoleStatus }) {
  return status === RoleStatus.ACTIVE ? (
    <Badge className="success">Active</Badge>
  ) : (
    <Badge className="neutral">Inactive</Badge>
  );
}
