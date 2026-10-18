import { TemplateDocKey, TemplateDocMetaKey } from "@tomato/constants";
import { SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { TemplateNameChangedEvent } from "../sync.events";

@SyncHandler()
export class TemplateHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get name() {
    return this.syncDoc.doc.getText(TemplateDocKey.NAME);
  }

  private get meta() {
    return this.syncDoc.doc.getMap<number>(TemplateDocKey.META);
  }

  setName(name: string): void {
    this.name.delete(0, this.name.length);
    this.name.insert(0, name);
    this.syncDoc.emit(new TemplateNameChangedEvent(name));
  }

  isReady(): boolean {
    return typeof this.meta.get(TemplateDocMetaKey.READY) === "number";
  }

  markReady(): void {
    this.meta.set(TemplateDocMetaKey.READY, Date.now());
  }
}
