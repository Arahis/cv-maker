import { Button } from "@/components/ui/button";
import TagBadge from "./TagBadge";
import Dropdown from "./Dropdown";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { SkillsOptions } from "..";
import { distance } from "fastest-levenshtein";

const filteredSkills = (
  input: string,
  skills: SkillsOptions[],
  threshold: number = 0.75,
) => {
  const normalized = input.trim().toLowerCase();

  return skills.filter((skill) => {
    const skillName = skill.name.toLowerCase();

    if (skillName.includes(normalized)) return true;

    const d = distance(normalized, skillName);
    const maxLen = Math.max(normalized.length, skillName.length);
    const similarity = 1 - d / maxLen;

    return similarity > threshold;
  });
};

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
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAlreadySelected = (skill: SkillsOptions) =>
    (value as SkillsOptions[]).some((s) => s.id === skill.id);

  // returns filtered options based on input in format {id, name}
  const filteredOptions = useMemo(() => {
    if (!input) return skills;
    return filteredSkills(input, skills, 0.5);
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
    const skillsToAdd: SkillsOptions[] = [];
    const userIds = new Set((value as SkillsOptions[]).map((s) => s.id));
    const userNames = new Set(
      (value as SkillsOptions[]).map((s) => s.name.toLowerCase()),
    );

    const inputValues = input.trim().split(",");
    // First normalize every item in array
    const normalizedInputs = inputValues
      .map((v) => v.trim().toLowerCase())
      .filter((v) => v !== "");

    // Then map to skills options if exists in skills list
    if (normalizedInputs.length === 0) return;

    for (const value of normalizedInputs) {
      const matchedSkill = skills.find(
        (skill) => skill.name.toLowerCase() === value,
      );

      const skillToAdd: SkillsOptions = matchedSkill
        ? matchedSkill
        : {
            id: crypto.randomUUID(),
            name: value.replace(/\b\w/g, (char) => char.toUpperCase()),
          };

      const exists =
        userIds.has(skillToAdd.id) ||
        userNames.has(skillToAdd.name.toLowerCase());

      if (!exists) skillsToAdd.push(skillToAdd);
    }
    // TODO: Also check if the tag(s) is already selected
    onChange([...value, ...skillsToAdd]);
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
