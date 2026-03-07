"use client";

import { Footer } from "../Footer";

export default function CSSIsolationPage() {
  return (
    <main className="page">
      {/* Hostile global CSS that simulates Vite defaults and other aggressive resets */}
      <style>{`
        button {
          background: #1a1a1a;
          color: white;
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
        }
        button:hover {
          border-color: #646cff;
        }
        input {
          border: 2px solid red;
          padding: 12px;
          font-size: 18px;
          background: yellow;
        }
        select {
          background: purple;
          color: white;
          padding: 10px;
          border: 3px solid lime;
        }
        textarea {
          background: navy;
          color: cyan;
          border: 4px dashed orange;
          font-family: "Comic Sans MS", cursive;
        }
        label {
          font-size: 24px;
          font-weight: 900;
          color: magenta;
          text-transform: uppercase;
        }
        svg {
          fill: currentColor;
        }
      `}</style>

      <h1>CSS Isolation Test</h1>
      <p className="page-description">
        This page applies aggressive global CSS overrides to verify that the
        Agentation toolbar remains visually correct. The styles below simulate
        Vite&apos;s default CSS, plus extreme overrides for inputs, selects,
        textareas, labels, and SVG fills.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Hostile global styles active</h2>
        <p style={{ color: "rgba(0,0,0,0.6)", marginBottom: "1rem" }}>
          These page elements are intentionally styled by the aggressive global
          CSS. The toolbar (bottom-right) should look completely normal.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
          <button>I&apos;m a black button (Vite default)</button>
          <input defaultValue="Red-bordered yellow input" />
          <select>
            <option>Purple select with lime border</option>
          </select>
          <textarea defaultValue="Navy textarea with orange dashed border" rows={3} />
          <label>Magenta uppercase label</label>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>What to verify</h2>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Toolbar buttons should have their normal dark background, not the hostile black</li>
          <li>Toolbar button hover states should still work</li>
          <li>Settings panel inputs/checkboxes should look normal</li>
          <li>SVG icons in the toolbar should not be filled solid</li>
          <li>Tooltips should appear correctly</li>
        </ol>
      </section>

      <Footer />
    </main>
  );
}
