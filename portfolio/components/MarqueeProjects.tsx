"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";

export default function MarqueeProjects() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = performance.now();
    let x = 0;

    const speed = 60; // px/sec

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      x -= speed * dt;

      // loop when we've shifted one full set width
      const w = track.scrollWidth / 2;
      if (w > 0 && x <= -w) x += w;

      track.style.transform = `translate3d(${x}px,0,0)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="marqueeSection">
      <div className="marqueeViewport">
        <div className="marqueeTrack" ref={trackRef}>
          {/* set A */}
          <ul className="marqueeList">
            {projects.map((p) => (
              <li className="marqueeItem" key={`a-${p.title}`}>
                <img className="marqueeImg" src={p.thumb} alt={p.title} />
              </li>
            ))}
          </ul>

          {/* set B (duplicate) */}
          <ul className="marqueeList" aria-hidden="true">
            {projects.map((p) => (
              <li className="marqueeItem" key={`b-${p.title}`}>
                <img className="marqueeImg" src={p.thumb} alt={p.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
