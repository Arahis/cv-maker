import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const TagBadge = ({
  tag,
  removeTag,
}: {
  tag: string;
  removeTag: () => void;
}) => (
  <Badge
    key={tag}
    variant="secondary"
    className="flex items-center gap-1 px-2 py-1"
  >
    {tag}
    <div onClick={removeTag}>
      <X className="h-3 w-3 cursor-pointer" />
    </div>
  </Badge>
);

export default TagBadge;
