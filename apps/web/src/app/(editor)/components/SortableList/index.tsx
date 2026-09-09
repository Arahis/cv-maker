import React, { useCallback, useState } from "react";
import type { ElementType, ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Active, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableOverlay } from "./components/SortableOverlay";
import { DragHandle, SortableItem } from "./components/SortableItem";

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
  items: T[];
  onMove(activeIndex: number, overIndex: number): void;
  renderItem(item: T, idx: number): ReactNode;
  renderOverlay?(item: T, idx: number): ReactNode;
  className?: string;
  as?: ElementType;
}

export function SortableList<T extends BaseItem>({
  items,
  onMove,
  renderItem,
  renderOverlay,
  className,
  as: Container = "ul",
}: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeItem = items.find((item) => item.id === active?.id);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    ({ active }: { active: Active }) => {
      // Every nested DndContext receives the drag-start event. Only the list
      // that owns the dragged id may create an active overlay.
      if (!items.some((item) => item.id === active.id)) return;

      setActive(active);
      setActiveIdx(active.data.current?.sortable?.index ?? 0);
    },
    [items],
  );

  const handleDragCancel = useCallback(() => {
    setActive(null);
    setActiveIdx(0);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
        const activeIndex = items.findIndex(({ id }) => id === active.id);
        const overIndex = items.findIndex(({ id }) => id === over.id);

        // Nested SortableLists receive the same DnD events. Ignore events
        // that belong to another list instead of passing -1 to useFieldArray.
        if (activeIndex < 0 || overIndex < 0) {
          setActive(null);
          setActiveIdx(0);
          return;
        }

        onMove(activeIndex, overIndex);
      }
      setActive(null);
      setActiveIdx(0);
    },
    [items, onMove],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <Container role="application" className={className}>
          {items.map((item, idx) => (
            <React.Fragment key={item.id}>
              {renderItem(item, idx)}
            </React.Fragment>
          ))}
        </Container>
      </SortableContext>
      <SortableOverlay>
        {activeItem
          ? (renderOverlay ?? renderItem)(activeItem, activeIdx)
          : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
