import PageShell from "@/components/PageShell";
import Intro from "@/components/Intro";
import ProjectList from "@/components/ProjectList";
import MarqueeProjects from "@/components/MarqueeProjects";

export default function HomePage() {
  return (
    <main className="page">
      <PageShell>
        <Intro />
        {/* <ProjectList /> */}

        {/* ONE marquee section (auto + scroll-controlled speed) */}
        <MarqueeProjects />
      </PageShell>
    </main>
  );
}
