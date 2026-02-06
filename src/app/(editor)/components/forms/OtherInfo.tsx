import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { SortableList } from "../SortableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguagesForm } from "@/lib/validation";
import { Trash2 } from "lucide-react";

const WorkExperienceItem = ({
  index,
  control,
  handleItemRemove,
}: {
  index: number;
  control: Control<LanguagesForm>;
  handleItemRemove: (index: number) => void;
}) => (
  <div>
    <div className="flex items-end justify-between">
      <SortableList.DragHandle variant="vertical" />
      <div className="mx-2 grid flex-1 grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`languages.${index}.languageName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="Add language" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`languages.${index}.languageLevel`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <Input placeholder="ex: Native speaker, B1, C1..." {...field} />
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

const OtherInfo = () => {
  const { control } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "languages",
  });

  return (
    <div>
      <div className="mb-4">
        <SortableList
          className="grid gap-4"
          items={fields}
          onMove={move}
          renderItem={(item, index) => (
            <SortableList.Item id={item.id}>
              <WorkExperienceItem
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
            languageName: "",
            languageLevel: "",
          })
        }
      >
        Add language
      </Button>
    </div>
  );
};

export default OtherInfo;
