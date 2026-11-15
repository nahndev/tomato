import { BoardView } from "@tomato/constants";
import { Button } from "@tomato/ui";
import { CalendarDaysIcon, ListTodoIcon, TableIcon } from "lucide-react";

interface BoardViewToggleProps {
  value: BoardView;
  views: BoardView[];
  onChange: (view: BoardView) => void;
}

export function BoardViewToggle({ value, views, onChange }: BoardViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      {views.includes(BoardView.TABLE) && (
        <Button
          variant={value === BoardView.TABLE ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label="Table view"
          aria-pressed={value === BoardView.TABLE}
          onClick={() => onChange(BoardView.TABLE)}
        >
          <TableIcon />
        </Button>
      )}
      {views.includes(BoardView.TASK) && (
        <Button
          variant={value === BoardView.TASK ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label="Task view"
          aria-pressed={value === BoardView.TASK}
          onClick={() => onChange(BoardView.TASK)}
        >
          <ListTodoIcon />
        </Button>
      )}
      {views.includes(BoardView.AGENDA) && (
        <Button
          variant={value === BoardView.AGENDA ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label="Agenda view"
          aria-pressed={value === BoardView.AGENDA}
          onClick={() => onChange(BoardView.AGENDA)}
        >
          <CalendarDaysIcon />
        </Button>
      )}
    </div>
  );
}
