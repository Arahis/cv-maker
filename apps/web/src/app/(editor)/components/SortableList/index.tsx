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
  className?: string;
  as?: ElementType;
}

export function SortableList<T extends BaseItem>({
  items,
  onMove,
  renderItem,
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

  const handleDragStart = useCallback(({ active }: { active: Active }) => {
    setActive(active);
    setActiveIdx(active.data.current?.sortable?.index ?? null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActive(null);
    setActiveIdx(0);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
        const activeIndex = items.findIndex(({ id }) => id === active.id);
        const overIndex = items.findIndex(({ id }) => id === over.id);
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
      <SortableContext items={items}>
        <Container role="application" className={className}>
          {items.map((item, idx) => (
            <React.Fragment key={item.id}>
              {renderItem(item, idx)}
            </React.Fragment>
          ))}
        </Container>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem, activeIdx) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
