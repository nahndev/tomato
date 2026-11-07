import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "./avatar";
import { FileBrowserProvider } from "./file-browser/file-browser-provider";

vi.mock("@tomato/ui", () => ({
  Avatar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AvatarImage: ({
    src,
    alt,
    onLoadingStatusChange,
  }: {
    src?: string;
    alt?: string;
    onLoadingStatusChange?: (status: string) => void;
  }) => (
    <img
      src={src}
      alt={alt}
      onLoad={() => onLoadingStatusChange?.("loaded")}
      onError={() => onLoadingStatusChange?.("error")}
    />
  ),
  AvatarFallback: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  Spinner: () => <span role="status" />,
}));

const FALLBACK = "AN";

function renderAvatar(props: Parameters<typeof Avatar>[0]) {
  return render(
    <FileBrowserProvider apiClient={axios.create()} path="/rest/storage">
      <Avatar alt="Ann" {...props}>
        {FALLBACK}
      </Avatar>
    </FileBrowserProvider>,
  );
}

describe("Avatar", () => {
  it("loads the file from the storage service", () => {
    renderAvatar({ uuid: "file-id" });
    expect(screen.getByRole("img", { name: "Ann" })).toHaveAttribute(
      "src",
      "/rest/storage/files/file-id/content",
    );
  });

  it("shows the fallback without a file", () => {
    renderAvatar({ uuid: null });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText(FALLBACK)).toBeInTheDocument();
  });

  it("shows a spinner until the image settles", () => {
    renderAvatar({ uuid: "file-id" });
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument();

    fireEvent.load(screen.getByRole("img"));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("falls back when the image fails", () => {
    renderAvatar({ uuid: "file-id" });
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText(FALLBACK)).toBeInTheDocument();
  });

  it("waits for a new image when the file changes", () => {
    const { rerender } = renderAvatar({ uuid: "file-id" });
    fireEvent.load(screen.getByRole("img"));

    rerender(
      <FileBrowserProvider apiClient={axios.create()} path="/rest/storage">
        <Avatar alt="Ann" uuid="other-id">
          {FALLBACK}
        </Avatar>
      </FileBrowserProvider>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("covers the avatar with one spinner while loading externally", () => {
    renderAvatar({ uuid: "file-id", isLoading: true });
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByText(FALLBACK)).toBeInTheDocument();
  });
});
