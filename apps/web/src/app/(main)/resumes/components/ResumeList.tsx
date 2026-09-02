"use client";

import { useEffect, useRef, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Copy,
  EllipsisVertical,
  Loader2,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { getResumeTemplateComponent } from "@/components/templates/components";
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
import { Badge } from "@/components/ui/badge";
import ResumePreviewSkeleton from "@/components/templates/ResumePreviewSkeleton";

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
  const Template = getResumeTemplateComponent(template);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(0);

  useEffect(() => {
    if (!previewRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setPreviewWidth(entry.contentRect.width);
    });

    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  const isScaled = previewWidth > 0;
  const scale = isScaled ? previewWidth / 794 : 0;

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
          className={cn(
            "relative flex rounded-md border-2 p-1 hover:border-blue-300",
          )}
        >
          {source === "local" && (
            <Badge className="absolute top-2 right-2 z-2">Local</Badge>
          )}
          <div
            ref={previewRef}
            className="relative aspect-[794/1123] w-full cursor-pointer overflow-hidden"
          >
            {!isScaled && <ResumePreviewSkeleton />}
            <div
              className="origin-top-left text-left"
              style={{
                width: 794,
                height: 1123,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                visibility: isScaled ? "visible" : "hidden",
              }}
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
            variant="ghost"
            size="sm"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
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
      <div className="mx-auto grid grid-cols-[repeat(2,minmax(0,200px))] justify-center gap-4 px-2 sm:grid-cols-[repeat(3,minmax(0,200px))] sm:px-4 md:grid-cols-[repeat(4,minmax(0,200px))] md:px-20 lg:grid-cols-[repeat(5,minmax(0,200px))] lg:px-40">
        {resumes.map((r) => (
          <div key={r.id} className="w-full max-w-[200px] justify-self-center">
            <ResumeCard resume={r} {...controls} />
          </div>
        ))}
      </div>
      {errorDialog}
    </>
  );
};

export default ResumeList;
