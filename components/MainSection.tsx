import { ReactNode, PropsWithChildren } from "react";

export default function MainSection({ children }: PropsWithChildren) {
  return (
    <main className="card bg-base-200 w-full max-w-lg flex-1 h-full overflow-hidden">
      <section id="page-content" className="h-full">
        {children}
      </section>
    </main>
  );
}
