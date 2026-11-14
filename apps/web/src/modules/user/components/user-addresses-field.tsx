import { USER_ADDRESS_MAX_COUNT } from "@tomato/constants";
import { Button, Input, Typography } from "@tomato/ui";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type { UserAddressDraft } from "../user.schemas";

const EMPTY_ADDRESS: UserAddressDraft = { street: "", city: "", postalCode: "", country: "" };

interface UserAddressesFieldProps {
  value: UserAddressDraft[];
  onChange: (value: UserAddressDraft[]) => void;
  isInvalid: (index: number, field: keyof UserAddressDraft) => boolean;
}

export function UserAddressesField({ value, onChange, isInvalid }: UserAddressesFieldProps) {
  function update(index: number, field: keyof UserAddressDraft, text: string) {
    onChange(value.map((address, i) => (i === index ? { ...address, [field]: text } : address)));
  }

  function renderInput(index: number, field: keyof UserAddressDraft, label: string) {
    return (
      <Input
        value={value[index]?.[field] ?? ""}
        onChange={(event) => update(index, field, event.target.value)}
        placeholder={label}
        aria-label={`Address ${index + 1} ${label}`}
        aria-invalid={isInvalid(index, field)}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {value.map((_, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="grid min-w-0 flex-1 gap-2 @lg:grid-cols-3">
            <div className="@lg:col-span-3">{renderInput(index, "street", "Street")}</div>
            {renderInput(index, "city", "City")}
            {renderInput(index, "postalCode", "Postal code")}
            {renderInput(index, "country", "Country")}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Remove address ${index + 1}`}
            className="mt-2 text-muted-foreground"
            onClick={() => onChange(value.filter((__, i) => i !== index))}
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={value.length >= USER_ADDRESS_MAX_COUNT}
        onClick={() => onChange([...value, EMPTY_ADDRESS])}
      >
        <PlusIcon className="size-4" strokeWidth={2} />
        <Typography>Add address</Typography>
      </Button>
    </div>
  );
}
