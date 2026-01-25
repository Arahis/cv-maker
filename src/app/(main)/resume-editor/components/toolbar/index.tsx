import { JSX } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Printer } from "lucide-react";
import { FileStack } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ResumeVarsPanel from "./ResumeVarsPanel";

const ToolbarTooltip = ({
  text = "Click Me!",
  children,
}: {
  text?: string;
  children: JSX.Element;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side="right">
      <p>{text}</p>
    </TooltipContent>
  </Tooltip>
);

const Toolbar = ({
  onPrintClick,
  onResumeVarChange,
  resumeVariants,
  variant,
}: {
  onPrintClick: () => void;
  onResumeVarChange: (resumeVar: any) => void;
  resumeVariants: Record<string, React.ElementType>;
  variant: string;
}) => {
  return (
    <div className="absolute bottom-4 z-100 ml-4 flex translate-y-[-25%] flex-col gap-1">
      <ToolbarTooltip text="Print resume">
        <Button onClick={onPrintClick}>
          <Printer />
        </Button>
      </ToolbarTooltip>

      <Popover>
        <ToolbarTooltip text="Resume variants">
          <PopoverTrigger asChild>
            <Button>
              <FileStack />
            </Button>
          </PopoverTrigger>
        </ToolbarTooltip>
        <PopoverContent side="right" align="end" className="z-50 w-[100%]">
          <ResumeVarsPanel
            variant={variant}
            onChange={onResumeVarChange}
            resumeVariants={resumeVariants}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Toolbar;
