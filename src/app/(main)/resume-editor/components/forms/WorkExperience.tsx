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
import { Textarea } from "@/components/ui/textarea";
import { WorkExperienceForm } from "@/lib/validation";
import { GripHorizontal } from "lucide-react";
import React from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";

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
    <GripHorizontal />
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
    <div className="flex w-full gap-2">
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
    <div className="flex w-full gap-2">
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

    {/* TODO: Change textarea to reach-text editor */}
    <FormField
      control={control}
      name={`workExperiences.${index}.description`}
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

const WorkExperience = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperiences",
  });

  return (
    <div>
      <div>
        {fields.map((item, idx) => (
          <WorkExperienceItem
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
            position: "",
            company: "",
            city: "",
            startDate: "",
            endDate: "",
            description: "",
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
