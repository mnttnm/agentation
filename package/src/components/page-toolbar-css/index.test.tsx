import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PageFeedbackToolbarCSS } from "./index";
import type { Annotation } from "../../types";

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

beforeEach(() => {
  vi.stubGlobal("navigator", {
    clipboard: mockClipboard,
    userAgent: "test-agent",
  });
  mockClipboard.writeText.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PageFeedbackToolbarCSS", () => {
  describe("DOM navigation shortcuts", () => {
    it("selects the parent element with Alt+ArrowUp", async () => {
      const handleAnnotation = vi.fn();
      const { container } = render(
        <>
          <div id="parent">
            <button id="child">Child</button>
          </div>
          <PageFeedbackToolbarCSS onAnnotationAdd={handleAnnotation} />
        </>,
      );
      const child = container.querySelector("#child") as HTMLElement;
      Object.defineProperty(document, "elementFromPoint", {
        configurable: true,
        value: vi.fn().mockReturnValue(child),
      });

      fireEvent.click(await screen.findByTitle("Start feedback mode"));
      fireEvent.click(child, { clientX: 20, clientY: 20 });

      const textarea = await screen.findByPlaceholderText("What should change?");
      expect(screen.getByText(/Alt\+↑ parent/)).toBeTruthy();

      fireEvent.keyDown(textarea, { key: "ArrowUp", altKey: true });
      fireEvent.change(textarea, { target: { value: "Inspect parent" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() => expect(handleAnnotation).toHaveBeenCalledOnce());
      expect(handleAnnotation.mock.calls[0][0].elementPath).toContain("#parent");
    });
  });

  describe("onAnnotationAdd callback", () => {
    it("should accept onAnnotationAdd prop without errors", () => {
      const handleAnnotation = vi.fn();
      expect(() =>
        render(<PageFeedbackToolbarCSS onAnnotationAdd={handleAnnotation} />)
      ).not.toThrow();
    });

    it("should type-check annotation callback parameter", () => {
      // This test verifies TypeScript types are correct at compile time
      const handleAnnotation = (annotation: Annotation) => {
        // Verify all expected properties are accessible
        expect(annotation).toHaveProperty("id");
        expect(annotation).toHaveProperty("x");
        expect(annotation).toHaveProperty("y");
        expect(annotation).toHaveProperty("comment");
        expect(annotation).toHaveProperty("element");
        expect(annotation).toHaveProperty("elementPath");
        expect(annotation).toHaveProperty("timestamp");
      };

      render(<PageFeedbackToolbarCSS onAnnotationAdd={handleAnnotation} />);
    });
  });

  describe("copyToClipboard prop", () => {
    it("should default copyToClipboard to true", () => {
      // Component should render without explicit copyToClipboard prop
      expect(() => render(<PageFeedbackToolbarCSS />)).not.toThrow();
    });

    it("should accept copyToClipboard={false} without errors", () => {
      expect(() =>
        render(<PageFeedbackToolbarCSS copyToClipboard={false} />)
      ).not.toThrow();
    });

    it("should accept copyToClipboard={true} without errors", () => {
      expect(() =>
        render(<PageFeedbackToolbarCSS copyToClipboard={true} />)
      ).not.toThrow();
    });
  });

  describe("combined props", () => {
    it("should accept both onAnnotationAdd and copyToClipboard props", () => {
      const handleAnnotation = vi.fn();
      expect(() =>
        render(
          <PageFeedbackToolbarCSS
            onAnnotationAdd={handleAnnotation}
            copyToClipboard={false}
          />
        )
      ).not.toThrow();
    });
  });
});

describe("Annotation type", () => {
  it("should include all required fields", () => {
    const annotation: Annotation = {
      id: "test-id",
      x: 50,
      y: 100,
      comment: "Test comment",
      element: "Button",
      elementPath: "body > div > button",
      timestamp: Date.now(),
    };

    expect(annotation.id).toBe("test-id");
    expect(annotation.x).toBe(50);
    expect(annotation.y).toBe(100);
    expect(annotation.comment).toBe("Test comment");
    expect(annotation.element).toBe("Button");
    expect(annotation.elementPath).toBe("body > div > button");
    expect(typeof annotation.timestamp).toBe("number");
  });

  it("should allow optional metadata fields", () => {
    const annotation: Annotation = {
      id: "test-id",
      x: 50,
      y: 100,
      comment: "Test comment",
      element: "Button",
      elementPath: "body > div > button",
      timestamp: Date.now(),
      selectedText: "Selected text content",
      boundingBox: { x: 100, y: 200, width: 150, height: 40 },
      nearbyText: "Context around the element",
      cssClasses: "btn btn-primary",
      nearbyElements: "div, span, a",
      computedStyles: "color: blue; font-size: 14px",
      fullPath: "html > body > div#app > main > button.btn",
      accessibility: "role=button, aria-label=Submit",
      isMultiSelect: false,
      isFixed: false,
    };

    expect(annotation.selectedText).toBe("Selected text content");
    expect(annotation.boundingBox).toEqual({
      x: 100,
      y: 200,
      width: 150,
      height: 40,
    });
    expect(annotation.cssClasses).toBe("btn btn-primary");
    expect(annotation.fullPath).toBe("html > body > div#app > main > button.btn");
    expect(annotation.accessibility).toBe("role=button, aria-label=Submit");
    expect(annotation.isMultiSelect).toBe(false);
    expect(annotation.isFixed).toBe(false);
  });
});
