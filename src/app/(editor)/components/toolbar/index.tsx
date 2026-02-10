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
import ResumeTemplatesPanel from "./ResumeTemplatesPanel";

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
  onResumeTemplateChange,
  template,
}: {
  onPrintClick: () => void;
  onResumeTemplateChange: (template: any) => void;
  template: string;
}) => {
  return (
    <div className="absolute z-10 flex h-full items-end">
      <div className="mb-4 ml-2 flex flex-col gap-1">
        <ToolbarTooltip text="Print resume">
          <Button onClick={onPrintClick}>
            <Printer />
          </Button>
        </ToolbarTooltip>

        <Popover modal={true}>
          <ToolbarTooltip text="Resume variants">
            <PopoverTrigger asChild>
              <Button>
                <FileStack />
              </Button>
            </PopoverTrigger>
          </ToolbarTooltip>
          <PopoverContent
            side="right"
            align="end"
            sideOffset={8}
            avoidCollisions={false}
            className="pointer-events-auto z-50 w-max max-w-(--radix-popover-content-available-width) overflow-auto overflow-x-auto"
          >
            <ResumeTemplatesPanel
              template={template}
              onChange={onResumeTemplateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Toolbar;
