import Loading from "@/components/Loading";

export function FullscreenLoading() {
  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <div>
        <Loading />
        <p className="mt-4">Resume creating...</p>
      </div>
    </div>
  );
}
