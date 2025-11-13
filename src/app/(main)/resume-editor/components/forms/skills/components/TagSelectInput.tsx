import { Button } from "@/components/ui/button";
import TagBadge from "./TagBadge";
import Dropdown from "./Dropdown";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { SkillsOptions } from "..";

function TagSelectInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  skills,
  value,
  onChange,
}: ControllerRenderProps<TFieldValues, TName> & {
  skills: SkillsOptions[];
}) {
  console.log({ value });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAlreadySelected = (skill: SkillsOptions) =>
    (value as SkillsOptions[]).some((s) => s.id === skill.id);

  // returns filtered options based on input in format {id, name}
  const filteredOptions = useMemo(() => {
    if (!input) return skills;
    return skills.filter((opt) =>
      opt.name.toLowerCase().includes(input.toLowerCase()),
    );
  }, [input, skills]);

  const resetInput = () => {
    setInput("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const addTag = (skill: SkillsOptions) => {
    if (!isAlreadySelected(skill)) {
      onChange([...value, skill]);
    }
    setInput("");
  };

  const handleTagRemove = (skill: SkillsOptions) => {
    onChange(value.filter((t: SkillsOptions) => t.id !== skill.id));
  };

  const handleAddTagFromInput = () => {
    const inputValues = input.trim().split(",");
    // Also check if the tag(s) is already selected
    onChange([...value, ...inputValues]);
    resetInput();
  };

  const handleSelectOption = (skill: SkillsOptions) => {
    addTag(skill);
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
            placeholder="Start with entering your skill..."
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
              item={(opt) => (
                <div className="flex w-full items-center justify-between">
                  <p>{opt.name}</p>
                  {isAlreadySelected(opt) && (
                    <p className="text-[10px]">Added</p>
                  )}
                </div>
              )}
              onSelect={handleSelectOption}
              isSelected={isAlreadySelected}
            />
          )}
        </div>
        <Button onClick={handleAddTagFromInput}>Add skill</Button>
      </div>

      {/* Tags under input */}
      <div className="mt-3 flex flex-wrap gap-2">
        {value.map((skill: SkillsOptions) => (
          <TagBadge
            key={skill.id}
            tag={skill.name}
            removeTag={() => handleTagRemove(skill)}
          />
        ))}
      </div>
    </div>
  );
}

export default TagSelectInput;
