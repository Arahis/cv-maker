import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type Skills = { id: string; name: string };

const TagBadge = ({
  tag,
  removeTag,
}: {
  tag: string;
  removeTag: (tag: string) => void;
}) => (
  <Badge
    key={tag}
    variant="secondary"
    className="flex items-center gap-1 px-2 py-1"
  >
    {tag}
    <div onClick={() => removeTag(tag)}>
      <X className="h-3 w-3 cursor-pointer" />
    </div>
  </Badge>
);

export function TagSelectInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: ControllerRenderProps<TFieldValues, TName> & {
    skills: Skills[];
  },
) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAlreadySelected = (tag: string) => selected.includes(tag);

  const filteredOptions = useMemo(() => {
    if (!input) return props.skills.map((s) => s.name);
    return props.skills
      .filter((opt) => opt.name.toLowerCase().includes(input.toLowerCase()))
      .map((s) => s.name);
  }, [input, props.skills]);

  const resetInput = () => {
    setInput("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const addTag = (tag: string) => {
    if (!isAlreadySelected(tag)) {
      setSelected((selected) => [...selected, tag]);
    }
    setInput("");
  };

  const handleTagRemove = (tag: string) => {
    setSelected((selected) => selected.filter((t) => t !== tag));
  };

  const handleAddTagFromInput = () => {
    const inputValues = input.trim().split(",");
    setSelected((prev) =>
      prev.includes(input) ? prev : [...prev, ...inputValues],
    );
    resetInput();
  };

  const handleSelectOption = (tag: string) => {
    addTag(tag);
    resetInput();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md">
      <div className="flex w-full gap-2">
        <div className="relative grow" ref={wrapperRef}>
          <Input
            ref={inputRef}
            className="pr-4"
            placeholder="Начни вводить навык..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim() !== "") {
                e.preventDefault();
                handleAddTagFromInput();
              }
            }}
          />

          {open && filteredOptions.length > 0 && (
            <Dropdown
              options={filteredOptions}
              onSelect={handleSelectOption}
              isSelected={isAlreadySelected}
            />
          )}
        </div>
        <Button onClick={handleAddTagFromInput}>Add skill</Button>
      </div>

      {/* Tags under input */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selected.map((tag) => (
          <TagBadge key={tag} tag={tag} removeTag={handleTagRemove} />
        ))}
      </div>
    </div>
  );
}

const Dropdown = ({
  options,
  onSelect,
  isSelected,
}: {
  options: string[];
  onSelect: (v: string) => void;
  isSelected: (v: string) => boolean;
}) => (
  <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md">
    <Command>
      <CommandList>
        {options.map((opt) => (
          <CommandItem
            key={opt}
            onSelect={() => onSelect(opt)}
            className={`cursor-pointer ${
              isSelected(opt) ? "text-muted-foreground" : ""
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <p>{opt}</p>
              {isSelected(opt) && <p className="text-[10px]">Added</p>}
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  </div>
);

const getHardSkills = () =>
  fetch(`/data/hardSkills.json`).then((m) => m.json());
const getSoftSkills = (locale: string = "en") =>
  fetch(`/data/softSkills.${locale}.json`).then((m) => m.json());

const Skills = () => {
  const [softSkills, setSoftSkills] = useState<Skills[]>([]);
  const [hardSkills, setHardSkills] = useState<Skills[]>([]);

  console.log({ hardSkills });

  useEffect(() => {
    getHardSkills().then((data) => setHardSkills(data.skills));
    getSoftSkills().then((data) => setSoftSkills(data.skills));
  }, []);

  const { control } = useFormContext();
  return (
    <div>
      <FormField
        control={control}
        name="skills.technicalSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technical skills</FormLabel>
            <FormControl>
              <TagSelectInput {...field} skills={hardSkills} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="skills.personalSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Personal skills</FormLabel>
            <FormControl>
              <TagSelectInput {...field} skills={softSkills} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default Skills;
