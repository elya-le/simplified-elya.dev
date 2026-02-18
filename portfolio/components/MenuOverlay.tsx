"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";

export default function MarqueeProjects() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);

  const rafRef = useRef<number>(0);
  const xRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // MARQUEE SCROLL (paused when activeIndex != null)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let last = performance.now();
    const speed = 30;

    const tick = (now: number) => {
      if (activeIndex !== null) return; // pause while detail overlay is open

      const dt = (now - last) / 1000;
      last = now;

      xRef.current -= speed * dt;

      const w = track.scrollWidth / 2;
      if (w > 0 && xRef.current <= -w) xRef.current += w;

      track.style.transform = `translate3d(${xRef.current}px,0,0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeIndex]);

  // title width measure (for your title reveal logic)
  useEffect(() => {
    titleRefs.current.forEach((el) => {
      if (!el) return;
      const width = el.scrollWidth;
      el.dataset.width = width.toString();
      el.style.width = "0px";
    });
  }, []);

  //  hover handlers (unchanged)
  const handleEnter = (index: number) => {
    const el = titleRefs.current[index];
    if (!el) return;

    const base = Number(el.dataset.width || "0");
    const buffer = 12; // prevents "(Communication Ap" clipping
    el.style.width = `${base + buffer}px`;
  };

  const handleLeave = (index: number) => {
    const el = titleRefs.current[index];
    if (!el) return;
    el.style.width = "0px";
  };

  const openProject = (i: number) => {
    setActiveIndex(i);
  };

  const closeProject = () => {
    setActiveIndex(null);

    // reset any expanded titles so you don't come back to a half-open state
    titleRefs.current.forEach((el) => {
      if (!el) return;
      el.style.width = "0px";
    });

    // kick marquee back on immediately
    cancelAnimationFrame(rafRef.current);

    const track = trackRef.current;
    if (!track) return;

    let last = performance.now();
    const speed = 30;

    const tick = (now: number) => {
      if (activeIndex !== null) return;

      const dt = (now - last) / 1000;
      last = now;

      xRef.current -= speed * dt;

      const w = track.scrollWidth / 2;
      if (w > 0 && xRef.current <= -w) xRef.current += w;

      track.style.transform = `translate3d(${xRef.current}px,0,0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // re-measure widths next frame (extra safety; cheap + stable)
    requestAnimationFrame(() => {
      titleRefs.current.forEach((el) => {
        if (!el) return;
        const width = el.scrollWidth;
        el.dataset.width = width.toString();
        el.style.width = "0px";
      });
    });
  };

  const activeProject = activeIndex !== null ? projects[activeIndex] : null;

  return (
    <section className="marqueeSection">
      {/* MARQUEE (always mounted) */}
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
                  <button
                    type="button"
                    className="marqueeButton"
                    onClick={() => openProject(i)}
                    aria-label={`Open ${p.title}`}
                  >
                    {/* title logic + markup unchanged */}
                    <span className="marqueeLabel">
                      <span className="marqueeLabelNum">({label})</span>
                      <span
                        className="marqueeLabelTitle"
                        ref={(el) => {
                          if (el) titleRefs.current[i] = el;
                        }}
                      >
                        ({p.title})
                      </span>
                    </span>

                    <img className="marqueeImg" src={p.thumb} alt={p.title} />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* set B */}
          <ul className="marqueeList" aria-hidden="true">
            {projects.map((p, i) => {
              const label = String(i + 1).padStart(2, "0");
              const idx = i + projects.length;

              return (
                <li
                  className="marqueeItem"
                  key={`b-${p.title}`}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={() => handleLeave(idx)}
                >
                  <button
                    type="button"
                    className="marqueeButton"
                    onClick={() => openProject(i)}
                    aria-label={`Open ${p.title}`}
                  >
                    {/* title logic + markup unchanged */}
                    <span className="marqueeLabel">
                      <span className="marqueeLabelNum">({label})</span>
                      <span
                        className="marqueeLabelTitle"
                        ref={(el) => {
                          if (el) titleRefs.current[idx] = el;
                        }}
                      >
                        ({p.title})
                      </span>
                    </span>

                    <img className="marqueeImg" src={p.thumb} alt={p.title} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* DETAIL OVERLAY (covers marquee, marquee stays mounted behind it) */}
      <div className={`marqueeOverlay ${activeProject ? "isOpen" : ""}`}>
        {activeProject && (
          <div className="marqueeDetail">
            {/* Desktop close (right side) */}
            <button
              className="marqueeClose marqueeCloseX"
              type="button"
              onClick={closeProject}
            >
              X Close
            </button>

            {/* Mobile close (down arrow on right side) */}
            <button
              className="marqueeClose marqueeCloseDown"
              type="button"
              onClick={closeProject}
              aria-label="Close"
            >
              ↓
            </button>

            <div className="marqueeDetailInner">
              <div className="marqueeDetailMedia">
                <img
                  className="marqueeDetailImg"
                  src={activeProject.thumb}
                  alt={activeProject.title}
                />
              </div>

              <div className="marqueeDetailPanel">
                <table className="marqueeDetailTable">
                  <tbody>
                    <tr>
                      <th>Project</th>
                      <td>{activeProject.title}</td>
                    </tr>
                    <tr>
                      <th>Link</th>
                      <td>
                        <a href={activeProject.href}>{activeProject.href}</a>
                      </td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>Write your descriptive text here.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
