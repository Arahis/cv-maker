import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { SortableList } from "../SortableList";
import { Button } from "@/components/ui/button";
import { SocialLinksForm } from "@/lib/validation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

const SocialLinkItem = ({
  index,
  control,
  handleItemRemove,
}: {
  index: number;
  control: Control<SocialLinksForm>;
  handleItemRemove: (index: number) => void;
}) => (
  <div>
    <div className="flex items-end justify-between">
      <SortableList.DragHandle variant="vertical" />
      <div className="mx-2 grid flex-1 grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`socialLinks.${index}.linkName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social profile</FormLabel>
              <FormControl>
                <Input
                  placeholder="LinkedIn, GitHub, Portfolio..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`socialLinks.${index}.linkAddress`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile link</FormLabel>
              <FormControl>
                <Input placeholder="Paste profile URL" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => handleItemRemove(index)}
      >
        <Trash2 />
      </Button>
    </div>
  </div>
);

const SocialLinks = () => {
  const { control } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "socialLinks",
  });

  return (
    <div className="pb-6">
      <div className="mb-4">
        <SortableList
          className="grid gap-4"
          items={fields}
          onMove={move}
          renderItem={(item, index) => (
            <SortableList.Item id={item.id}>
              <SocialLinkItem
                index={index}
                control={control}
                handleItemRemove={remove}
              />
            </SortableList.Item>
          )}
        />
      </div>

      <Button
        type="button"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            linkName: "",
            linkAddress: "",
          })
        }
      >
        Add Social Link
      </Button>
    </div>
  );
};

export default SocialLinks;
