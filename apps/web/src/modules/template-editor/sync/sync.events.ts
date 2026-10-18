import type { Session, Widget, WidgetProperties } from "@tomato/types";
import { SyncEvent } from "@/shared/lib/sync";

export class WidgetAddedEvent extends SyncEvent {
  constructor(
    readonly widget: Widget,
    readonly before: Widget | null,
  ) {
    super();
  }
}

export class WidgetRemovedEvent extends SyncEvent {
  constructor(readonly widgetId: string) {
    super();
  }
}

export class WidgetPropertyChangedEvent extends SyncEvent {
  constructor(
    readonly widget: Widget,
    readonly key: keyof WidgetProperties,
  ) {
    super();
  }
}

export class SessionAddedEvent extends SyncEvent {
  constructor(readonly session: Session) {
    super();
  }
}

export class SessionUpdatedEvent extends SyncEvent {
  constructor(readonly sessionId: string) {
    super();
  }
}

export class SessionRemovedEvent extends SyncEvent {
  constructor(readonly sessionId: string) {
    super();
  }
}

export class LayoutUpdatedEvent extends SyncEvent {
  constructor(
    readonly widgetId: string,
    readonly sessionId: string,
  ) {
    super();
  }
}

export class TemplateNameChangedEvent extends SyncEvent {
  constructor(readonly name: string) {
    super();
  }
}
