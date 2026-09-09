import React, { createContext, memo, useContext, useMemo } from "react";
import type { CSSProperties, ElementType, PropsWithChildren } from "react";
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, GripVertical } from "lucide-react";

interface Props {
  id: UniqueIdentifier;
  as?: ElementType;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context | null>(null);

function useSortableItemContext() {
  const ctx = useContext(SortableItemContext);
  if (!ctx) throw new Error("DragHandle must be used inside <SortableItem />");
  return ctx;
}

export const SortableItem = memo(function SortableItem({
  children,
  id,
  as: ItemTag = "li",
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <ItemTag className="SortableItem" ref={setNodeRef} style={style}>
        {children}
      </ItemTag>
    </SortableItemContext.Provider>
  );
});

const grips = {
  vertical: GripVertical,
  horizontal: GripHorizontal,
} as const;

export function DragHandle({
  variant = "horizontal",
}: {
  variant?: "vertical" | "horizontal";
}) {
  const { attributes, listeners, ref } = useSortableItemContext();

  const Grip = grips[variant];

  return (
    <button
      type="button"
      className="DragHandle h-8 cursor-move"
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <Grip />
    </button>
  );
}
