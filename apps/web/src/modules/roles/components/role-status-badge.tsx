import { RoleStatus } from "@tomato/constants";
import { Badge, Typography } from "@tomato/ui";

export function RoleStatusBadge({ status }: { status: RoleStatus }) {
  return status === RoleStatus.ACTIVE ? (
    <Badge className="success"><Typography>Active</Typography></Badge>
  ) : (
    <Badge className="neutral"><Typography>Inactive</Typography></Badge>
  );
}
