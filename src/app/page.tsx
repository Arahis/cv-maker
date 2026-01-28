import MainCreateNewResumeButton from "./(main)/components/MainCreateNewResumeButton";

type HighlightsItem = { text: string; color: "pink" | "blue" | "red" };

const highlightsItems: HighlightsItem[] = [
  { text: "No registration required ", color: "pink" },
  { text: "Your data stays on your device", color: "blue" },
  { text: "100% free, indie project", color: "red" },
];

const HighlightsItem = ({
  item,
  count,
}: {
  item: HighlightsItem;
  count: number;
}) => {
  return (
    <div className="relative flex items-center">
      <div
        className="font-brand absolute z-[-1] text-8xl font-bold opacity-50"
        style={{ color: `var(--brand-${item.color})` }}
      >
        {count}.
      </div>
      <div>
        <p className="ml-6 font-semibold">{item.text}</p>
      </div>
    </div>
  );
};

const Highlights = () => (
  <div className="grid grid-cols-4">
    {highlightsItems.map((item, i) => (
      <HighlightsItem item={item} count={i + 1} key={i} />
    ))}
    <div className="gradient-separator py-4 pl-20 text-left">
      <p className="mb-2 text-2xl font-semibold">Like it?</p>
      <p>Support us with a</p>
      <a
        href="https://paypal.me/cvoop"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold"
      >
        donation💙
      </a>
    </div>
  </div>
);

const Hero = () => {
  return (
    <div>
      <div className="py-16">
        <p className="font-tech mb-2 text-lg font-semibold text-gray-500">
          <span className="pr-2 font-bold text-red-700">[</span>
          <span className="bg-blue-100">
            We’re still building this site, but you’re welcome to use it.
          </span>
          <span className="pl-2 font-bold text-red-700">]</span>
        </p>
      </div>
      <div className="flex h-[64vh] flex-col items-center justify-center">
        <div className="font-brand mb-12">
          <h1 className="mb-4 text-6xl font-bold">Make your resume go WOOP!</h1>
          <h2 className="mb-16 text-4xl font-bold">
            Build a resume that gets you hired —{" "}
            <span className="gradient-underline">for free</span>.
          </h2>
          <h3 className="font-tech text-xl font-semibold">
            An indie resume builder made by people who couldn’t find free
            templates they actually liked.
            <br /> So we built our own.
          </h3>
        </div>
        <MainCreateNewResumeButton />
      </div>
      <Highlights />
    </div>
  );
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-400 text-center">
      <Hero />
    </main>
  );
}
