import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useFormContext } from "react-hook-form";

const Summary = () => {
  const { control } = useFormContext();

  return (
    <div>
      <FormField
        control={control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary</FormLabel>
            <FormControl>
              <Textarea placeholder="Summary" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default Summary;
