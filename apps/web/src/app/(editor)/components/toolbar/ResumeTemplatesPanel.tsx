import { trackEvent } from "@/components/analytics/events";
import { resumeTemplatesPreview } from "@/components/templates/previews";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ResumeTemplatesPanel = ({
  onChange,
  template,
}: {
  onChange: (template: any) => void;
  template: string;
}) => {
  const onVarChange = (key: string) => {
    trackEvent("switch_var", { var: key });
    onChange(key);
  };

  return (
    <div className="flex gap-2">
      {Object.entries(resumeTemplatesPreview).map(([key, src]) => (
        <div
          key={key}
          className={cn(
            "flex rounded-md border p-1 hover:border-blue-300",
            template === key && "border-2 border-blue-300",
          )}
        >
          <div
            onClick={() => onVarChange(key)}
            className="relative aspect-794/1123 w-35 cursor-pointer overflow-hidden"
          >
            <Image
              src={src}
              alt={`Template option ${key}`}
              fill
              sizes="140px"
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeTemplatesPanel;
