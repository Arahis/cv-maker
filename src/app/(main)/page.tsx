import MainCreateNewResumeButton from "./components/MainCreateNewResumeButton";

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
    <div className="relative mx-auto flex items-center py-8">
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
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
    <div className="gradient-separator md:gradient-separator-left gradient-separator-bottom order-first mx-auto px-12 py-8 text-center md:order-last md:text-left">
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

    {highlightsItems.map((item, i) => (
      <HighlightsItem item={item} count={i + 1} key={i} />
    ))}
  </div>
);

const Hero = () => {
  return (
    <div>
      <div className="py-8">
        <p className="font-tech text-lg font-semibold text-gray-500 md:mb-2">
          <span className="pr-2 font-bold text-red-700">[</span>
          <span className="bg-blue-100">
            We’re still building this site, but you’re welcome to use it.
          </span>
          <span className="pl-2 font-bold text-red-700">]</span>
        </p>
      </div>
      <div className="flex h-[50vh] flex-col items-center justify-center md:h-[60vh]">
        <div className="font-brand mb-8 md:mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Make your resume go WOOP!
          </h1>
          <h2 className="mb-8 text-2xl font-bold md:mb-16 md:text-4xl">
            Build a resume that gets you hired —{" "}
            <span className="gradient-underline">for free</span>.
          </h2>
          <h3 className="font-tech font-semibold md:text-xl">
            Free resume templates that actually look good.
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
    <main className="mx-auto w-full max-w-400 px-4 text-center">
      <Hero />
    </main>
  );
}
