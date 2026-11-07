import { render, screen } from "@testing-library/react";
import axios from "axios";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "./avatar";
import { FileBrowserProvider } from "./file-browser/file-browser-provider";

vi.mock("@tomato/ui", () => ({
  Avatar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) =>
    src ? <img src={src} alt={alt} /> : null,
  AvatarFallback: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
}));

describe("Avatar", () => {
  it("loads the file from the storage service", () => {
    render(
      <FileBrowserProvider apiClient={axios.create()} path="/rest/storage">
        <Avatar uuid="file-id" alt="Ann" fallback="AN" />
      </FileBrowserProvider>,
    );
    expect(screen.getByRole("img", { name: "Ann" })).toHaveAttribute(
      "src",
      "/rest/storage/files/file-id/content",
    );
  });
});
