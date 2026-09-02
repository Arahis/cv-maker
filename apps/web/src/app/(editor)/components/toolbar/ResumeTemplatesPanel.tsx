import { trackEvent } from "@/components/analytics/events";
import { resumeTemplatesPreview } from "@/components/templates/previews";
import ResumeTemplatePreview from "@/components/templates/ResumeTemplatePreview";
import { cn } from "@/lib/utils";

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
      {Object.keys(resumeTemplatesPreview).map((key) => (
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
            <ResumeTemplatePreview
              template={key as keyof typeof resumeTemplatesPreview}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeTemplatesPanel;
