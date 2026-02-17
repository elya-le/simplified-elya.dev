import Link from "next/link";
import { projects } from "@/lib/projects";

export default function ProjectList() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "14px" }}>
        {projects.map((p) => (
          <li key={p.title}>
            <Link className="projectLink" href={p.href}>
              <span className="projectTitle">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}