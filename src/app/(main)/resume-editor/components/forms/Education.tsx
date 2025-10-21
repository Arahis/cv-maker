import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EducationForm } from "@/lib/validation";
import { GripHorizontal } from "lucide-react";
import React from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";

const EducationItem = ({
  index,
  control,
  handleItemRemove,
}: {
  index: number;
  control: Control<EducationForm>;
  handleItemRemove: (index: number) => void;
}) => (
  <div>
    <GripHorizontal />
    <FormField
      control={control}
      name={`educations.${index}.degree`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Degree</FormLabel>
          <FormControl>
            <Input placeholder="Degree" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name={`educations.${index}.institution`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Institution</FormLabel>
          <FormControl>
            <Input placeholder="Institution" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name={`educations.${index}.city`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Input placeholder="City" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <div className="flex w-full gap-2">
      <FormField
        control={control}
        name={`educations.${index}.startDate`}
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
        name={`educations.${index}.endDate`}
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
      name={`educations.${index}.description`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="Description" />
          </FormControl>
        </FormItem>
      )}
    />

    <Button type="button" onClick={() => handleItemRemove(index)}>
      Remove
    </Button>
  </div>
);

const Education = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  return (
    <div>
      <div>
        {fields.map((item, idx) => (
          <EducationItem
            key={item.id}
            index={idx}
            control={control}
            handleItemRemove={remove}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={() =>
          append({
            degree: "",
            institution: "",
            startDate: "",
            endDate: "",
            city: "",
            description: "",
            isFullDate: false,
          })
        }
      >
        Add Education
      </Button>
    </div>
  );
};

export default Education;
