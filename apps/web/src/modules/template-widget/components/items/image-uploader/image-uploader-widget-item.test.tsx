import { WidgetType } from "@tomato/constants";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageUploaderWidgetItem } from "./image-uploader-widget-item";

const { ImageFilePicker } = vi.hoisted(() => ({ ImageFilePicker: vi.fn(() => null) }));

vi.mock("@tomato/storage-ui", () => ({ ImageFilePicker }));

const WIDGET = { id: "photo", type: WidgetType.IMAGE_UPLOADER, label: "Photo" };

describe("ImageUploaderWidgetItem", () => {
  it("passes the file id and onChange to ImageFilePicker", () => {
    const onChange = vi.fn();
    render(<ImageUploaderWidgetItem widget={WIDGET} value="image-a" onChange={onChange} />);

    expect(ImageFilePicker).toHaveBeenLastCalledWith({ id: "photo", value: "image-a", onChange }, undefined);
  });

  it("treats a legacy data URL value as empty", () => {
    render(<ImageUploaderWidgetItem widget={WIDGET} value={{ dataUrl: "data:" } as unknown as string} />);

    expect(ImageFilePicker).toHaveBeenLastCalledWith(expect.objectContaining({ value: undefined }), undefined);
  });
});
