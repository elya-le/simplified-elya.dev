"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";

export default function MarqueeProjects() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- MARQUEE MOTION ---------------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = performance.now();
    let x = 0;

    const speed = 30;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      x -= speed * dt;

      const w = track.scrollWidth / 2;
      if (w > 0 && x <= -w) x += w;

      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------------- WIDTH MEASURE LOGIC ---------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const labels = container.querySelectorAll(".marqueeLabel");

    labels.forEach((label) => {
      const num = label.querySelector(
        ".marqueeLabelNum"
      ) as HTMLElement | null;
      const title = label.querySelector(
        ".marqueeLabelTitle"
      ) as HTMLElement | null;

      if (!num || !title) return;

      // measure natural width
      const titleWidth = title.scrollWidth;
      const numWidth = num.scrollWidth;

      // set initial inline styles
      title.style.width = "0px";
      num.style.width = `${numWidth}px`;

      title.style.transition = "width 250ms ease";
      num.style.transition = "width 250ms ease";

      label.addEventListener("mouseenter", () => {
        title.style.width = `${titleWidth}px`;
        num.style.width = "0px";
      });

      label.addEventListener("mouseleave", () => {
        title.style.width = "0px";
        num.style.width = `${numWidth}px`;
      });
    });
  }, []);

  return (
    <section className="marqueeSection" ref={containerRef}>
      <div className="marqueeViewport">
        <div className="marqueeTrack" ref={trackRef}>
          {/* set A */}
          <ul className="marqueeList">
            {projects.map((p, i) => {
              const label = String(i + 1).padStart(2, "0");
              return (
                <li className="marqueeItem" key={`a-${p.title}`}>
                  <span className="marqueeLabel">
                    <span className="marqueeLabelNum">({label})</span>
                    <span className="marqueeLabelTitle">{p.title}</span>
                  </span>

                  <img className="marqueeImg" src={p.thumb} alt={p.title} />
                </li>
              );
            })}
          </ul>

          {/* set B */}
          <ul className="marqueeList" aria-hidden="true">
            {projects.map((p, i) => {
              const label = String(i + 1).padStart(2, "0");
              return (
                <li className="marqueeItem" key={`b-${p.title}`}>
                  <span className="marqueeLabel">
                    <span className="marqueeLabelNum">({label})</span>
                    <span className="marqueeLabelTitle">{p.title}</span>
                  </span>

                  <img className="marqueeImg" src={p.thumb} alt={p.title} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
