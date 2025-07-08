"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  PersonalInfoForm,
  PersonalInfoKeys,
  personalInfoSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Control, useForm } from "react-hook-form";

const usePersonalInfoForm = () =>
  useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      photo: undefined,
      firstName: "",
      lastName: "",
      jobTitle: "",
      city: "",
      country: "",
      phone: "",
      email: "",
    },
  });

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
  const f = usePersonalInfoForm();
  function onSubmit(values: PersonalInfoForm) {
    console.log(values);
  }
  return (
    <Form {...f}>
      <form onSubmit={f.handleSubmit(onSubmit)}>
        {/* TODO: Add immediate validation for the Photo field  */}
        <FormField
          control={f.control}
          name="photo"
          render={({ field: { value, ...fieldValues } }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...fieldValues}
                  placeholder="firstName"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    fieldValues.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TextFormField
          control={f.control}
          name="firstName"
          title="First name"
        />
        <TextFormField control={f.control} name="lastName" title="Last name" />

        <TextFormField
          control={f.control}
          name="jobTitle"
          title="Job title"
          label="Position"
        />

        <TextFormField control={f.control} name="city" title="City" />
        <TextFormField control={f.control} name="country" title="Country" />
        <TextFormField control={f.control} name="phone" title="Phone" />
        <TextFormField control={f.control} name="email" title="E-mail" />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PersonalInfo;
