import Hero from "./components/Hero";
import Templates from "./components/Templates";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-400 space-y-32 px-4 text-center">
      <Hero />
      <Templates />
    </main>
  );
}
