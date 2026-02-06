import React from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { SortableList } from "../SortableList";
import { Button } from "@/components/ui/button";
import { CustomSectionForm } from "@/lib/validation";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Plus } from "lucide-react";

const CustomItem = ({
  index,
  control,
  handleItemRemove,
}: {
  index: number;
  control: Control<CustomSectionForm>;
  handleItemRemove: (index: number) => void;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `customSections.${index}.sectionItems`,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <SortableList.DragHandle />

        <Button
          type="button"
          variant="secondary"
          onClick={() => handleItemRemove(index)}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="grid gap-4">
        {!fields.length && (
          <Button
            variant="secondary"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                title: "",
                value: "",
              })
            }
          >
            Add fields
          </Button>
        )}
        <FormField
          control={control}
          name={`customSections.${index}.sectionName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom section</FormLabel>
              <FormControl>
                <Input placeholder="Section title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {fields.map((item, idx) => {
          return (
            <div key={idx} className="flex w-full items-end gap-4">
              <FormField
                control={control}
                name={`customSections.${index}.sectionItems.${idx}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Item title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`customSections.${index}.sectionItems.${idx}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Item value" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    append({
                      id: crypto.randomUUID(),
                      title: "",
                      value: "",
                    })
                  }
                >
                  <Plus />
                </Button>
                <Button variant="secondary" onClick={() => remove(idx)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CustomSection = () => {
  const { control } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "customSections",
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
              <CustomItem
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
            sectionName: "",
            sectionItems: [
              {
                id: crypto.randomUUID(),
                title: "",
                value: "",
              },
            ],
          })
        }
      >
        Add custom section
      </Button>
    </div>
  );
};

export default CustomSection;
