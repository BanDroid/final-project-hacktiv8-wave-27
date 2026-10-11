import Dock from "../components/Dock";
import MainSection from "../components/MainSection";
import Topbar from "../components/Topbar";
import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2 pb-[3.5rem]">
      <Topbar />
      <MainSection>{children}</MainSection>
      <Dock />
    </div>
  );
}
