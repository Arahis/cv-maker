import { saveResumeTemplate } from "@/lib/indexedDB";
import { isDesktopLike } from "@/lib/utils";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Toolbar from "./toolbar";
import ResumePreview from "./ResumePreview";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { trackEvent } from "@/components/analytics/events";
import {
  ResumeTemplateKey,
  resumeTemplates,
} from "@/components/templates/components";

const ResumePreviewWrapper = ({
  resumeId,
  resumeTemplate,
}: {
  resumeId: string;
  resumeTemplate: ResumeTemplateKey | undefined;
}) => {
  const [template, setTemplate] = useState<ResumeTemplateKey | undefined>(
    resumeTemplate,
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    onAfterPrint: () => trackEvent("printed", { variant: template }),
  });

  const onResumeTemplateChange = async (newVar: ResumeTemplateKey) => {
    setTemplate(newVar);
    try {
      await saveResumeTemplate(resumeId, newVar);
    } catch (e) {
      console.error("Failed to save resume variant", e);
    }
  };

  const handlePrintClick = (device: "web" | "touch") => {
    trackEvent("print_click", { device });
    if (isDesktopLike()) {
      reactToPrintFn();
      return;
    }
    const url = `/print?id=${encodeURIComponent(resumeId)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!isDesktopLike()) {
    return (
      <Drawer direction="bottom">
        <DrawerTrigger asChild className="absolute right-4 bottom-4">
          <Button variant="default">
            <Eye />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-dvh">
          <DrawerTitle className="sr-only">Move Goal</DrawerTitle>
          <div className="relative flex overflow-y-auto">
            <Toolbar
              onPrintClick={() => handlePrintClick("touch")}
              onResumeTemplateChange={onResumeTemplateChange}
              resumeTemplates={resumeTemplates}
              template={template || "template1"}
            />
            <ResumePreview
              key={template}
              resumeId={resumeId}
              ref={contentRef}
              resumeComponent={resumeTemplates[template || "template1"]}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="relative flex w-1/2 overflow-y-auto">
      <Toolbar
        onPrintClick={() => handlePrintClick("web")}
        onResumeTemplateChange={onResumeTemplateChange}
        resumeTemplates={resumeTemplates}
        template={template || "template1"}
      />
      <ResumePreview
        key={template}
        resumeId={resumeId}
        ref={contentRef}
        resumeComponent={resumeTemplates[template || "template1"]}
      />
    </div>
  );
};

export default ResumePreviewWrapper;
