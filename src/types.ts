import { Vector2 } from "@liamattclarke/vector-n";

export enum DragState {
  Idle = 0,
  Holding = 1,
  Dragging = 2,
}

export type DragEvent = {
  pointerEvent: PointerEvent;
  dragStart?: Vector2;
  dragOffset?: Vector2;
  dragOffsetDelta?: Vector2;
}

export interface DragEventHandler {
  (detail: DragEvent): void;
}

export type DragHandlerOptions = {
  dragStartThreshold?: number;
  onDragGrab?: DragEventHandler;
  onDragStart?: DragEventHandler;
  onDragMove?: DragEventHandler;
  onDragEnd?: DragEventHandler;
  onDragCancel?: DragEventHandler;
}
