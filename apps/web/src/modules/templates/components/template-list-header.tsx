import { TEMPLATE_LIST_COLUMNS } from "../templates.constants";

export function TemplateListHeader() {
  return (
    <div
      role="row"
      className={`grid ${TEMPLATE_LIST_COLUMNS} items-center gap-4 px-4 text-xs font-medium uppercase text-muted-foreground`}
    >
      <span role="columnheader">Name</span>
      <span role="columnheader">Description</span>
      <span role="columnheader">Updated</span>
      <span role="columnheader" className="sr-only">
        Actions
      </span>
    </div>
  );
}
