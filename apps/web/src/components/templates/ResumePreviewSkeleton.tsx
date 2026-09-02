const skeletonLines = ["w-full", "w-11/12", "w-4/5", "w-full", "w-3/4"];

const ResumePreviewSkeleton = () => {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-10 bg-gray-50 p-[8%]">
      <div className="animate-pulse">
        <div className="h-4 w-2/5 rounded-sm bg-gray-300" />
        <div className="mt-2 h-2 w-1/3 rounded-sm bg-gray-300" />

        <div className="mt-8 grid grid-cols-[3fr_2fr] gap-[8%]">
          {["left", "right"].map((column) => (
            <div key={column}>
              <div className="mb-4 h-3 w-1/3 rounded-sm bg-gray-400" />
              <div className="space-y-2">
                {skeletonLines.map((width, index) => (
                  <div
                    key={`${column}-${index}`}
                    className={`h-2 rounded-sm bg-gray-300 ${width}`}
                  />
                ))}
              </div>
              <div className="mt-8 mb-4 h-3 w-1/2 rounded-sm bg-gray-400" />
              <div className="space-y-2">
                {skeletonLines.slice(1, 4).map((width, index) => (
                  <div
                    key={`${column}-second-${index}`}
                    className={`h-2 rounded-sm bg-gray-300 ${width}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewSkeleton;
