import { LandingHeader } from "@/components/LandingHeader";// We will create this next

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      {/* We will add a footer later */}
    </div>
  );
}