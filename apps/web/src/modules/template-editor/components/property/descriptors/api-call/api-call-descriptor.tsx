"use client";

import { ApiCallMethod, ApiCallResponseType } from "@tomato/constants";
import type { ApiCallConfig, ApiCallJsonMapping } from "@tomato/types";
import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@tomato/ui";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type { WidgetPropertyFieldProps } from "../../../../template-editor.types";
import { ComponentSelect } from "./component-select";
import { HostSelect } from "./host-select";
import { JsonEditor } from "./json-editor";
import { KeyValueListEditor } from "./key-value-list-editor";
import { MethodSelect } from "./method-select";
import { UrlEditor } from "./url-editor";

const DEFAULT_CONFIG: ApiCallConfig = {
  method: ApiCallMethod.GET,
  url: "",
  params: [],
  headers: [],
  response: { type: ApiCallResponseType.JSON, show: false, jsonMappings: [] },
};

/** Request and response configuration for the api-call widget. */
export function ApiCallDescriptor({ widgetId, value, onChange }: WidgetPropertyFieldProps<"apiCall">) {
  const config = value ?? DEFAULT_CONFIG;
  const { response } = config;
  const jsonMappings = response.jsonMappings ?? [];

  function patch(next: Partial<ApiCallConfig>) {
    onChange({ ...config, ...next });
  }

  function patchResponse(next: Partial<ApiCallConfig["response"]>) {
    patch({ response: { ...response, ...next } });
  }

  function updateJsonMapping(id: string, next: Partial<ApiCallJsonMapping>) {
    patchResponse({ jsonMappings: jsonMappings.map((mapping) => (mapping.id === id ? { ...mapping, ...next } : mapping)) });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">Request</p>

        <div className="flex flex-col gap-1.5">
          <Label>Host</Label>
          <HostSelect value={config.hostId} onChange={(hostId) => patch({ hostId })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>URL</Label>
          <div className="flex items-start gap-1.5">
            <MethodSelect value={config.method} onChange={(method) => patch({ method })} />
            <div className="min-w-0 flex-1">
              <UrlEditor widgetId={widgetId} value={config.url} onChange={(url) => patch({ url })} />
            </div>
          </div>
        </div>

        <KeyValueListEditor
          label="Params"
          widgetId={widgetId}
          value={config.params}
          onChange={(params) => patch({ params })}
        />
        <KeyValueListEditor
          label="Headers"
          widgetId={widgetId}
          value={config.headers}
          onChange={(headers) => patch({ headers })}
        />

        <div className="flex flex-col gap-1.5">
          <Label>Payload</Label>
          <JsonEditor widgetId={widgetId} value={config.payload} onChange={(payload) => patch({ payload })} />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">Response</p>

        <div className="flex flex-col gap-1.5">
          <Label>Type</Label>
          <Select
            value={response.type}
            onValueChange={(type) => patchResponse({ type: type as ApiCallResponseType })}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ApiCallResponseType.JSON}>JSON</SelectItem>
              <SelectItem value={ApiCallResponseType.IMAGE}>Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={response.show ?? false}
            onCheckedChange={(checked) => patchResponse({ show: checked === true })}
          />
          Show after load
        </label>

        {response.type === ApiCallResponseType.IMAGE ? (
          <div className="flex flex-col gap-1.5">
            <Label>Fill component</Label>
            <ComponentSelect
              excludeWidgetId={widgetId}
              value={response.imageWidgetId}
              onChange={(imageWidgetId) => patchResponse({ imageWidgetId })}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label>Fill mapping</Label>
            <div className="flex flex-col gap-1">
              {jsonMappings.length === 0 && <span className="text-xs text-muted-foreground">None yet</span>}
              {jsonMappings.map((mapping) => (
                <div key={mapping.id} className="flex items-center gap-1">
                  <Input
                    value={mapping.key}
                    placeholder="data.user.name"
                    aria-label="Response key"
                    className="h-8"
                    onChange={(event) => updateJsonMapping(mapping.id, { key: event.target.value })}
                  />
                  <ComponentSelect
                    excludeWidgetId={widgetId}
                    value={mapping.widgetId}
                    onChange={(id) => updateJsonMapping(mapping.id, { widgetId: id })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete"
                    onClick={() => patchResponse({ jsonMappings: jsonMappings.filter((item) => item.id !== mapping.id) })}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => patchResponse({ jsonMappings: [...jsonMappings, { id: crypto.randomUUID(), key: "" }] })}
            >
              <PlusIcon />
              Add mapping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
