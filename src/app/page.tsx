// app/page.tsx
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <h1 className="text-3xl p-6">Home Page</h1>
    </main>
  );
}
