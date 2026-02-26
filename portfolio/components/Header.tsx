"use client";

import { useEffect, useState } from "react";
import MenuOverlay from "@/components/MenuOverlay";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="container" style={{ paddingTop: 22, paddingBottom: 22 }}>
          <div style={{ display: "flex",  justifyContent: "flex-end"  }}>
            <button className="kicker" onClick={() => setOpen(true)} style={btnReset}>
              MENU
            </button>
          </div>
        </div>
        <div style={{ height: 1, width: "100%", background: "rgba(0,0,0,0.08)" }} />
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const btnReset: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
};