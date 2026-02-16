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
import { InputHTMLAttributes } from "react";
import { sanitizePhone } from "./lib/sanitizePhone";

const TextFormField = ({
  name,
  label,
  control,
  ...props
}: {
  name: PersonalInfoKeys;
  label?: string;
  control: Control<PersonalInfoForm>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value">) => {
  const isPhoneField = name === "phone";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* Additional DIV container to resolve issue with LastPass breaking layout in FormItem */}
          <div>
            <FormLabel className="mb-2">{label ?? name}</FormLabel>
            <FormControl>
              <Input
                {...field}
                {...props}
                //  to skip the error with photo field
                value={typeof field.value === "string" ? field.value : ""}
                inputMode={isPhoneField ? "tel" : props.inputMode}
                onChange={(e) => {
                  if (!isPhoneField) {
                    field.onChange(e);
                    return;
                  }
                  field.onChange(sanitizePhone(e.target.value));
                }}
              />
            </FormControl>
            <FormMessage />
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
              placeholder="First name"
              label="First name"
            />
            <TextFormField
              control={control}
              name="lastName"
              placeholder="Last name"
              label="Last name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextFormField
              control={control}
              name="country"
              placeholder="Country"
              label="Country"
            />
            <TextFormField
              control={control}
              name="city"
              placeholder="City"
              label="City"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <TextFormField
          control={control}
          name="jobTitle"
          placeholder="Job title"
          label="Position"
        />

        <div className="grid grid-cols-2 gap-4">
          <TextFormField
            control={control}
            inputMode="tel"
            pattern="[0-9+\s\(\)]+"
            name="phone"
            placeholder="ex: +1(234) 567 890"
            label="Phone"
          />
          <TextFormField
            control={control}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="E-mail"
            label="E-mail"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
