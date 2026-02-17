import PageShell from "@/components/PageShell";
import Intro from "@/components/Intro";
import ProjectList from "@/components/ProjectList";

export default function HomePage() {
  return (
    <main className="page">
      <PageShell>
        <Intro />
        <ProjectList />
      </PageShell>
    </main>
  );
}
