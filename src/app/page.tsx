import MainCreateNewResumeButton from "./(main)/components/MainCreateNewResumeButton";

const Hero = () => {
  return (
    <div>
      <p className="font-tech mb-30 font-semibold text-gray-500">
        <span className="pr-1 font-bold text-red-700">[</span>We’re still
        building this site, but you’re welcome to use it.
        <span className="pl-1 font-bold text-red-700">]</span>
      </p>
      <div className="mb-12">
        <h1 className="font-brand mb-4 text-6xl font-bold">
          Make your resume go WOOP!
        </h1>
        <h2 className="text-4xl font-bold">
          Build a resume that gets you hired — for free.
        </h2>
      </div>
      <MainCreateNewResumeButton />
    </div>
  );
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-300 text-center">
      <div className="flex h-[80vh] items-center justify-center">
        <Hero />
      </div>
    </main>
  );
}
