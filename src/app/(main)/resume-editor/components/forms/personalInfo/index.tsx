"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PersonalInfoForm, PersonalInfoKeys } from "@/lib/validation";
import React from "react";
import { Control, useFormContext } from "react-hook-form";
import PhotoUploader from "./PhotoUploader";

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
          <FormLabel>{label ? label : name}</FormLabel>
          <FormControl>
            <Input
              placeholder={title}
              {...field}
              //  to skip the error with photo field
              value={typeof field.value === "string" ? field.value : ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

const PersonalInfo = () => {
  const { control } = useFormContext();

  return (
    <div>
      {/* TODO: Add immediate validation for the Photo field  */}
      <FormField
        control={control}
        name="photo"
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
      <TextFormField control={control} name="firstName" title="First name" />
      <TextFormField control={control} name="lastName" title="Last name" />

      <TextFormField
        control={control}
        name="jobTitle"
        title="Job title"
        label="Position"
      />

      <TextFormField control={control} name="city" title="City" />
      <TextFormField control={control} name="country" title="Country" />
      <TextFormField control={control} name="phone" title="Phone" />
      <TextFormField control={control} name="email" title="E-mail" />

      <Button type="submit">Next step?</Button>
    </div>
  );
};

export default PersonalInfo;
