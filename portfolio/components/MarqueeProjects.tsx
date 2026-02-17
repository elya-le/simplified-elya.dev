"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { projects } from "@/lib/projects";

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * One marquee:
 * - always auto-moving
 * - when user scrolls while this section is in view, scroll adds/subtracts speed (“scrub”)
 */
export default function MarqueeProjects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // duplicate so it loops seamlessly
  const items = useMemo(() => [...projects, ...projects], []);

  useEffect(() => {
    // console.log("Marquee mounted", { trackWidth: track.scrollWidth, section });
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (prefersReduced) return;

    let raf = 0;
    let last = performance.now();

    // position + speed
    let x = 0;
    let baseSpeed = 70;     // px/sec always moving
    let boost = 0;          // user-driven extra speed
    let inView = false;

    const loopWidth = () => track.scrollWidth / 2;

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0.25 }
    );
    io.observe(section);

    // Wheel modifies boost while in view (scroll-to-speed control)
    const onWheel = (e: WheelEvent) => {
      if (!inView) return;

      // prevent the page from scrolling while you're "scrubbing" the marquee
      // (feels like the original “bottom scroll controls the marquee”)
      e.preventDefault();

      // deltaY positive -> faster left, negative -> slower / reverse
      // tune multiplier to taste
      boost += e.deltaY * 0.12;

      // clamp boost so it doesn't go insane
      boost = Math.max(-220, Math.min(220, boost));
    };

    // non-passive required for preventDefault
    window.addEventListener("wheel", onWheel, { passive: false });

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // boost eases back to 0 gradually (so it doesn't stay forever)
      boost *= Math.pow(0.08, dt); // stronger decay feels snappy

      const speed = baseSpeed + boost; // px/sec
      x -= speed * dt;

      const w = loopWidth();
      if (Math.abs(x) >= w) x += w;

      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onResize = () => {
      x = 0;
      track.style.transform = "translate3d(0,0,0)";
      last = performance.now();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel as any);
      io.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="home-bottom">
      <div className="marquee marquee-fade">
        <div className="marquee-track" ref={trackRef}>
          <ul className="marquee-list" aria-label="Project marquee">
            {items.map((p, idx) => {
              // show indexes based on original list (not duplicated)
              const originalIndex = (idx % projects.length) + 1;

              return (
                <li className="marquee-item" key={`${p.title}-${idx}`}>
                  <Link className="marquee-link" href={p.href}>
                    <div className="marquee-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="marquee-img"
                        src={p.thumb}
                        alt={p.title}
                        loading="eager"
                      />

                      <div className="marquee-overlay">
                        <div className="marquee-titleRow">
                          <div className="marquee-titleLeft">
                            <span className="marquee-index">
                              ({pad2(originalIndex)})
                            </span>
                            <span className="marquee-title">{p.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
