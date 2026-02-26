"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "white",
        color: "black",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 200ms ease",
      }}
      aria-hidden={!open}
    >
      <div style={{ height: "100%", overflow: "auto", justifyItems: "end", textAlign: "right"}}>
        <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
            <button className="kicker" onClick={onClose} style={btnReset}>
              CLOSE
            </button>
          </div>

          <nav style={{ paddingTop: 56 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 18 }}>
              {routes.map((r) => (
                <li key={r.href}>
                  <Link className="menuLink" href={r.href} onClick={onClose}>
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ paddingTop: 64, }}>
            <div className="kicker">CONTACT</div>
            <div style={{ paddingTop: 16, display: "grid", gap: 8 }}>
              <a className="smallLink" href="mailto:hello@elya.dev">
                hello@elya.dev
              </a>
              <div className="smallLink" style={{ opacity: 0.7 }}>
                New Orleans, LA
              </div>
            </div>
          </div>

          <div style={{ paddingTop: 64 }}>
            <div className="kicker">SHOP</div>
            <div style={{ paddingTop: 16, display: "grid", gap: 8 }}>
              <a className="smallLink" href="#" onClick={(e) => e.preventDefault()}>
                Ceramics for sale
              </a>
              <a className="smallLink" href="#" onClick={(e) => e.preventDefault()}>
                ///
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnReset: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
};