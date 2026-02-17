import type { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>;
}