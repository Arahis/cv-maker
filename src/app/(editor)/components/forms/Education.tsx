import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EducationForm } from "@/lib/validation";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { SortableList } from "../SortableList";
import { Trash2 } from "lucide-react";
import { DatePickerInput } from "@/components/DatePicker";

const EducationItem = ({
  index,
  control,
  handleItemRemove,
}: {
  index: number;
  control: Control<EducationForm>;
  handleItemRemove: (index: number) => void;
}) => {
  return (
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} className="md:w-[70%]" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`educations.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePickerInput {...field} />
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
                  <DatePickerInput {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const Education = () => {
  const { control } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "educations",
  });

  return (
    <div>
      <div className="mb-4">
        <SortableList
          items={fields}
          onMove={move}
          className="grid gap-4"
          renderItem={(item, index) => (
            <SortableList.Item id={item.id}>
              <EducationItem
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
            degree: "",
            institution: "",
            startDate: "",
            endDate: "",
            city: "",
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
