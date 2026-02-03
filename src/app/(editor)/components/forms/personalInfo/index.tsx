"use client";

import { Control, useFormContext } from "react-hook-form";
import {
  PersonalInfoForm,
  PersonalInfoKeys,
  ResumeForm,
} from "@/lib/validation";
import PhotoUploader from "./PhotoUploader";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const TextFormField = ({
  name,
  title,
  label,
  control,
}: {
  name: PersonalInfoKeys;
  title: string;
  label?: string;
  control: Control<PersonalInfoForm>;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* Additional DIV container to resolve issue with LastPass breaking layout in FormItem */}
          <div>
            <FormLabel className="mb-2">{label ? label : name}</FormLabel>
            <FormControl>
              <Input
                placeholder={title}
                {...field}
                //  to skip the error with photo field
                value={typeof field.value === "string" ? field.value : ""}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
};

const PersonalInfo = () => {
  const { control } = useFormContext<ResumeForm>();

  return (
    <div className="grid gap-2">
      <div className="mb-2 flex flex-col gap-6 md:flex-row">
        <FormField
          control={control}
          name="avatarCropData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <PhotoUploader {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid w-full gap-4">
          <div className="grid grid-cols-2 gap-4">
            <TextFormField
              control={control}
              name="firstName"
              title="First name"
              label="First name"
            />
            <TextFormField
              control={control}
              name="lastName"
              title="Last name"
              label="Last name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextFormField
              control={control}
              name="city"
              title="City"
              label="City"
            />
            <TextFormField
              control={control}
              name="country"
              title="Country"
              label="Country"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <TextFormField
          control={control}
          name="jobTitle"
          title="Job title"
          label="Position"
        />

        <div className="grid grid-cols-2 gap-4">
          <TextFormField
            control={control}
            name="phone"
            title="Phone"
            label="Phone"
          />
          <TextFormField
            control={control}
            name="email"
            title="E-mail"
            label="E-mail"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
