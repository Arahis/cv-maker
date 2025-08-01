import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useFormContext } from "react-hook-form";

const Skills = () => {
  const { control } = useFormContext();
  return (
    <div>
      <FormField
        control={control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Textarea placeholder="Skills" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default Skills;
