import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Picture } from "./picture";

const skeleton = (container: HTMLElement) => container.querySelector('[data-slot="skeleton"]');

describe("Picture", () => {
  it("shows a skeleton until the image is loaded", () => {
    const { container } = render(<Picture src="/image.png" alt="Map" />);

    expect(skeleton(container)).toBeInTheDocument();
    fireEvent.load(screen.getByRole("img", { name: "Map" }));

    expect(skeleton(container)).not.toBeInTheDocument();
  });

  it("shows the fallback without a source or when the image fails", () => {
    const { container, rerender } = render(<Picture fallback="none" />);
    expect(screen.getByText("none")).toBeInTheDocument();

    rerender(<Picture src="/broken.png" alt="Map" fallback="none" />);
    fireEvent.error(screen.getByRole("img", { name: "Map" }));

    expect(screen.getByText("none")).toBeInTheDocument();
    expect(skeleton(container)).not.toBeInTheDocument();
  });
});
