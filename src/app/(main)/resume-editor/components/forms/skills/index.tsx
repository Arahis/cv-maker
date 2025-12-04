import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { SkillsForm } from "@/lib/validation";

import React, { useEffect, useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import TagSelectInput from "./components/TagSelectInput";

export type SkillsOptions = { id: string; name: string };

const getHardSkills = () =>
  fetch(`/data/hardSkills.json`).then((m) => m.json());
const getSoftSkills = (locale: string = "en") =>
  fetch(`/data/softSkills.${locale}.json`).then((m) => m.json());

const HardSkills = ({ control }: { control: Control<SkillsForm> }) => {
  const [hardSkills, setHardSkills] = useState<SkillsOptions[]>([]);

  useEffect(() => {
    getHardSkills().then((data) => setHardSkills(data.skills));
  }, []);

  return (
    <FormField
      control={control}
      name="skills.technical"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Technical skills</FormLabel>
          <FormControl>
            <TagSelectInput {...field} skills={hardSkills} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

const SoftSkills = ({ control }: { control: Control<SkillsForm> }) => {
  const [softSkills, setSoftSkills] = useState<SkillsOptions[]>([]);

  useEffect(() => {
    getSoftSkills().then((data) => setSoftSkills(data.skills));
  }, []);

  return (
    <FormField
      control={control}
      name="skills.personal"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Personal skills</FormLabel>
          <FormControl>
            <TagSelectInput {...field} skills={softSkills} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

const Skills = () => {
  const { control } = useFormContext();

  return (
    <div>
      <HardSkills control={control} />
      <SoftSkills control={control} />
    </div>
  );
};

export default Skills;
