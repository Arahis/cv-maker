"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Copy,
  EllipsisVertical,
  Loader2,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  DEFAULT_RESUME_TEMPLATE_COMPONENT,
  resumeTemplates,
} from "@/components/templates/components";

import { format, isValid, parseISO } from "date-fns";
import {
  ResumeController,
  ResumeListItem,
  useResumeController,
} from "../../hooks/useResumeController";
import { ErrorDialog } from "../../components/ErrorDialog";
import { DeleteResumeDialog } from "./DeleteResumeDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: create in separate file to import in different places
const getScaleForA4 = (scale: number) => {
  const WIDTH = 794;
  const HEIGHT = 1123;
  return {
    scaledWidth: WIDTH * scale,
    scaledHeight: HEIGHT * scale,
    width: WIDTH,
    height: HEIGHT,
    scale,
  };
};

const ResumeCard = ({
  resume,
  copyResume,
  syncResume,
  deleteResume,
  openResume,
}: Omit<
  ResumeController,
  "resumes" | "isLoading" | "quotaResetError" | "clearQuotaResetError"
> & {
  resume: ResumeListItem;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    id,
    template,
    data,
    source,
    isAuthenticated,
    isCopying,
    isSyncing,
    isDeleting,
    updatedAt,
  } = resume;
  const Template =
    resumeTemplates[template] ?? DEFAULT_RESUME_TEMPLATE_COMPONENT;

  const { scaledWidth, scaledHeight, scale, width, height } =
    getScaleForA4(0.25);

  const updatedAtDate =
    typeof updatedAt === "number" ? new Date(updatedAt) : parseISO(updatedAt);
  const updatedResumeDate = isValid(updatedAtDate)
    ? format(updatedAtDate, "dd.MM.yyyy")
    : "";

  return (
    <div key={id}>
      <div
        onClick={() => openResume({ resumeId: id, source })}
        className="cursor-pointer"
      >
        <div
          className={cn("flex rounded-md border-2 p-1 hover:border-blue-300")}
        >
          <div
            className="cursor-pointer overflow-hidden"
            style={{ width: scaledWidth, height: scaledHeight }}
          >
            <div
              className="origin-top-left transform text-left"
              style={{ width: width, height: height, scale: scale }}
            >
              <Template data={data} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-left text-sm">{data.title || "Untitled"}</p>
          <p className="text-left text-xs text-gray-400">{updatedResumeDate}</p>
        </div>
        {!isAuthenticated ? (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            variant="outline"
            size="sm"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Delete
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDeleting || isCopying || isSyncing}
                aria-label="Resume actions"
              >
                {isDeleting || isCopying || isSyncing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <EllipsisVertical />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={source === "local" || isCopying}
                onSelect={() => {
                  if (source === "account") {
                    copyResume({ resumeId: id, source });
                  }
                }}
              >
                <Copy />
                Copy
              </DropdownMenuItem>
              {source === "local" && (
                <DropdownMenuItem
                  disabled={isSyncing}
                  onSelect={() => syncResume(id)}
                >
                  <RefreshCcw />
                  Sync to account
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isDeleting}
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <DeleteResumeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
        onConfirm={() => {
          deleteResume({ resumeId: id, source });
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
};

const ResumeList = () => {
  const {
    isLoading,
    resumes,
    quotaResetError,
    clearQuotaResetError,
    ...controls
  } = useResumeController();
  const { scaledWidth } = getScaleForA4(0.25);

  const errorDialog = (
    <ErrorDialog
      open={Boolean(quotaResetError)}
      onOpenChange={(open) => {
        if (!open) clearQuotaResetError();
      }}
      message={quotaResetError ?? ""}
    />
  );

  if (isLoading) {
    return (
      <>
        <div className="py-24 leading-7">
          <p>Loading...</p>
        </div>
        {errorDialog}
      </>
    );
  }

  if (resumes.length === 0) {
    return (
      <>
        <div className="py-24 leading-7">
          <p>Looks like it is a lot of empty space here!</p>
          <p>Try and Create you first resume!</p>
        </div>
        {errorDialog}
      </>
    );
  }

  return (
    <>
      <div
        className="mx-auto grid w-[60%] justify-center gap-4"
        style={{
          gridTemplateColumns: `repeat(auto-fill, ${scaledWidth + 8}px)`,
        }}
      >
        {resumes.map((r) => (
          <ResumeCard key={r.id} resume={r} {...controls} />
        ))}
      </div>
      {errorDialog}
    </>
  );
};

export default ResumeList;
