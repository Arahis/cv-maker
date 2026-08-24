import { isDesktopLike } from "@/lib/utils";
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
import { ResumeTemplateKey } from "@/components/templates/components";

const ResumePreviewWrapper = ({
  resumeTemplate,
  ref,
  onPrintClick,
  onResumeTemplateChange,
}: {
  resumeTemplate: ResumeTemplateKey | undefined;
  ref: React.RefObject<HTMLDivElement | null>;
  onPrintClick: () => void;
  onResumeTemplateChange: (t: ResumeTemplateKey) => void;
}) => {
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
              onPrintClick={onPrintClick}
              onResumeTemplateChange={onResumeTemplateChange}
              template={resumeTemplate || "template1"}
            />
            <ResumePreview
              key={resumeTemplate}
              ref={ref}
              template={resumeTemplate}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="relative flex w-1/2 overflow-y-auto">
      <Toolbar
        onPrintClick={onPrintClick}
        onResumeTemplateChange={onResumeTemplateChange}
        template={resumeTemplate || "template1"}
      />
      <ResumePreview key={resumeTemplate} ref={ref} template={resumeTemplate} />
    </div>
  );
};

export default ResumePreviewWrapper;
