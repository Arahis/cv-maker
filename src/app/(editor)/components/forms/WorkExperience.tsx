"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkExperienceForm } from "@/lib/validation";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { SortableList } from "../SortableList";
import { TextEditor } from "@/components/editor";
import { EMPTY_LEXICAL_STATE } from "@/lib/formUtils";
import { Trash2 } from "lucide-react";

const WorkExperienceItem = ({
  index,
  control,
  handleItemRemove,
}: {
  index: number;
  control: Control<WorkExperienceForm>;
  handleItemRemove: (index: number) => void;
}) => (
  <div>
    <div className="flex items-start justify-between">
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
      <FormField
        control={control}
        name={`workExperiences.${index}.position`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl>
              <Input placeholder="Position" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="grid w-full grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`workExperiences.${index}.company`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Company" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`workExperiences.${index}.city`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:w-[70%]">
        <FormField
          control={control}
          name={`workExperiences.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Start date"
                  type="date"
                  // TODO: try to remove this line and see what will happen
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`workExperiences.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="End date"
                  type="date"
                  // TODO: try to remove this line and see what will happen
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={`workExperiences.${index}.isFullDate`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`date-${index}`}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
                <Label htmlFor={`date-${index}`}>Show full year</Label>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`workExperiences.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <TextEditor {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  </div>
);

const WorkExperience = () => {
  const { control } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "workExperiences",
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
            position: "",
            company: "",
            city: "",
            startDate: "",
            endDate: "",
            description: EMPTY_LEXICAL_STATE,
            isFullDate: false,
          })
        }
      >
        Add work Experience
      </Button>
    </div>
  );
};

export default WorkExperience;
