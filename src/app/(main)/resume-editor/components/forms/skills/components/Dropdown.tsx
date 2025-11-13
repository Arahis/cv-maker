import { Command, CommandItem, CommandList } from "@/components/ui/command";

const Dropdown = <T,>({
  options,
  onSelect,
  isSelected,
  item,
}: {
  options: T[];
  onSelect: (v: T) => void;
  isSelected: (v: T) => boolean;
  item: (opt: T) => React.ReactNode;
}) => (
  <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md">
    <Command>
      <CommandList>
        {options.map((opt, i) => (
          <CommandItem
            key={i}
            onSelect={() => onSelect(opt)}
            className={`cursor-pointer ${
              isSelected(opt) ? "text-muted-foreground" : ""
            }`}
          >
            {item(opt)}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  </div>
);

export default Dropdown;
