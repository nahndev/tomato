"use client";

import { ApiCallMethod } from "@tomato/constants";
import { Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { ColorEnum } from "../../../../template-editor.constants";

const METHOD_COLOR: Record<ApiCallMethod, ColorEnum> = {
  [ApiCallMethod.GET]: ColorEnum.GREEN,
  [ApiCallMethod.POST]: ColorEnum.BLUE,
  [ApiCallMethod.PATCH]: ColorEnum.YELLOW,
  [ApiCallMethod.PUT]: ColorEnum.ORANGE,
  [ApiCallMethod.DELETE]: ColorEnum.RED,
};

interface MethodSelectProps {
  value: ApiCallMethod;
  onChange: (method: ApiCallMethod) => void;
}

export function MethodSelect({ value, onChange }: MethodSelectProps) {
  return (
    <Select value={value} onValueChange={(method) => onChange(method as ApiCallMethod)}>
      <SelectTrigger size="sm" className="w-28 shrink-0" aria-label="HTTP method">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(ApiCallMethod).map((method) => (
          <SelectItem key={method} value={method}>
            <Badge className="text-white" style={{ backgroundColor: METHOD_COLOR[method] }}>
              {method}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
