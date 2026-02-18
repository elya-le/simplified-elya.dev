import PageShell from "@/components/PageShell";
import Intro from "@/components/Intro";
import MarqueeProjects from "@/components/MarqueeProjects";

export default function HomePage() {
  return (
    <main className="page">
      <PageShell>
        <Intro />
      </PageShell>
      <MarqueeProjects />
    </main>
  );
}
