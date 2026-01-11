import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { TextEditor } from "@/components/editor";
import { useFormContext } from "react-hook-form";

const Summary = () => {
  const { control } = useFormContext();

  return (
    <div>
      <FormField
        control={control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary</FormLabel>
            <FormControl>
              <TextEditor placeholder="Summary" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default Summary;
