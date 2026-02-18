"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";

export default function MarqueeProjects() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);

  // MARQUEE SCROLL
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

  // TITLE WIDTH MEASURE
  useEffect(() => {
    titleRefs.current.forEach((el) => {
      if (!el) return;
      const width = el.scrollWidth;
      el.dataset.width = width.toString();
      el.style.width = "0px";
    });
  }, []);

  const handleEnter = (index: number) => {
    const el = titleRefs.current[index];
    if (!el) return;
    el.style.width = `${el.dataset.width}px`;
  };

  const handleLeave = (index: number) => {
    const el = titleRefs.current[index];
    if (!el) return;
    el.style.width = "0px";
  };

  return (
    <section className="marqueeSection">
      <div className="marqueeViewport">
        <div className="marqueeTrack" ref={trackRef}>
          {/* set A */}
          <ul className="marqueeList">
            {projects.map((p, i) => {
              const label = String(i + 1).padStart(2, "0");
              return (
                <li
                  className="marqueeItem"
                  key={`a-${p.title}`}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span className="marqueeLabel">
                    <span className="marqueeLabelNum">({label})</span>
                    <span
                      className="marqueeLabelTitle"
                      ref={(el) => {
                        if (el) titleRefs.current[i] = el;
                      }}
                    >
                      {p.title}
                    </span>
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
              const idx = i + projects.length; // offset index for duplicate set

              return (
                <li
                  className="marqueeItem"
                  key={`b-${p.title}`}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={() => handleLeave(idx)}
                >
                  <span className="marqueeLabel">
                    <span className="marqueeLabelNum">({label})</span>
                    <span
                      className="marqueeLabelTitle"
                      ref={(el) => {
                        if (el) titleRefs.current[idx] = el;
                      }}
                    >
                      {p.title}
                    </span>
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
