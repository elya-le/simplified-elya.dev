"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";

export default function HorizontalScrollProjects() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const viewport = viewportRef.current;
    if (!wrap || !viewport) return;

    // Activate when the section is on screen (near bottom)
    const io = new IntersectionObserver(
      (entries) => {
        setActive(entries.some((e) => e.isIntersecting));
      },
      { threshold: 0.2 }
    );

    io.observe(wrap);

    // Wheel -> horizontal scroll
    const onWheel = (e: WheelEvent) => {
      if (!active) return;

      // If user is over the horizontal area, redirect vertical scroll to horizontal
      const canScrollLeft = viewport.scrollLeft > 0;
      const canScrollRight =
        viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1;

      // If there’s still horizontal room, consume wheel
      if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
        e.preventDefault();
        viewport.scrollLeft += e.deltaY;
      }
      // If no horizontal room, let the page continue scrolling normally.
    };

    // Must be non-passive to preventDefault
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      io.disconnect();
      window.removeEventListener("wheel", onWheel as any);
    };
  }, [active]);

  return (
    <section ref={wrapRef} className="hscroll">
      <div className="hscroll-title">Scroll for more projects</div>

      <div ref={viewportRef} className="hscroll-viewport">
        <div className="hscroll-row">
          {projects.map((p) => (
            <div className="hscroll-card" key={p.title}>
              <Link className="marquee-project-link" href={p.href}>
                <div className="marquee-item_img-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="marquee-item_img-cover"
                    src={p.thumb}
                    alt={p.title}
                    loading="lazy"
                  />
                </div>
                <div className="marquee-item_title">{p.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
