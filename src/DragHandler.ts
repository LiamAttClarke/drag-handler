import { Vector2 } from "@liamattclarke/vector-n";
import {
  DragEventHandler,
  DragHandlerOptions,
  DragState,
} from "./types";

const DEFAULT_OPTIONS: DragHandlerOptions = {
  dragStartThreshold: 5,
};

export default class DragHandler {
  dragHandles: Element[];

  dragState: DragState;

  dragStartThreshold: number;

  dragStart = new Vector2(0, 0);

  dragOffset = new Vector2(0, 0);

  onDragGrab?: DragEventHandler;

  onDragStart?: DragEventHandler;

  onDragMove?: DragEventHandler;

  onDragEnd?: DragEventHandler;

  onDragCancel?: DragEventHandler;

  constructor(dragHandles: Element|Element[], options: DragHandlerOptions) {
    const opts: DragHandlerOptions = { ...DEFAULT_OPTIONS, ...options };
    this.dragHandles = dragHandles instanceof Array ? dragHandles : [dragHandles];
    this.dragState = DragState.Idle;
    this.dragStartThreshold = opts.dragStartThreshold || 0;
    this.dragHandles.forEach(dragHandle => {
      dragHandle.addEventListener("pointerdown", e => this.onPointerDown(e as PointerEvent));
      dragHandle.addEventListener("pointermove", e => this.onPointerMove(e as PointerEvent));
      dragHandle.addEventListener("pointerup", e => this.onPointerUp(e as PointerEvent));
    });
    this.onDragGrab = opts.onDragGrab;
    this.onDragStart = opts.onDragStart;
    this.onDragMove = opts.onDragMove;
    this.onDragEnd = opts.onDragEnd;
    this.onDragCancel = opts.onDragCancel;
  }

  onPointerDown(event: PointerEvent) {
    // Reject non-primary mouse buttons (usually left-click)
    if (event.button > 0) return;
    const dragHandle = event.currentTarget as Element;
    dragHandle.setPointerCapture(event.pointerId);
    this.dragState = DragState.Holding;
    this.dragStart = new Vector2(event.pageX, event.pageY);
    this.dragOffset = new Vector2(0, 0);
    const detail = { pointerEvent: event, dragStart: this.dragStart };
    if (this.onDragGrab) {
      this.onDragGrab(detail);
    } else {
      dragHandle.dispatchEvent(new CustomEvent("drag-grab", { detail }));
    }
  }

  onPointerMove(event: PointerEvent) {
    // Reject non-primary mouse buttons (usually left-click)
    if (event.button > 0) return;
    const dragHandle = event.currentTarget;
    const dragDistance = new Vector2(event.pageX, event.pageY)
      .subtract(this.dragStart)
      .magnitude();
    if (this.dragState === DragState.Holding && dragDistance > this.dragStartThreshold) {
      this.dragState = DragState.Dragging;
      const detail = { pointerEvent: event, dragStart: this.dragStart };
      if (this.onDragStart) {
        this.onDragStart(detail);
      } else if (dragHandle) {
        dragHandle.dispatchEvent(new CustomEvent("drag-start", { detail }));
      }
    }
    if (this.dragState === DragState.Dragging) {
      const dragOffset = new Vector2(event.pageX, event.pageY).subtract(this.dragStart);
      const detail = {
        pointerEvent: event,
        dragOffset,
        dragOffsetDelta: dragOffset.subtract(this.dragOffset),
      };
      if (this.onDragMove) {
        this.onDragMove(detail);
      } else if (dragHandle) {
        dragHandle.dispatchEvent(new CustomEvent("drag-move", { detail }));
      }
      this.dragOffset = dragOffset;
    }
  }

  onPointerUp(event: PointerEvent) {
    // Reject non-primary mouse buttons (usually left-click)
    if (event.button > 0) return;
    const dragHandle = event.currentTarget as Element;
    dragHandle.releasePointerCapture(event.pointerId);
    const currentDragState = this.dragState;
    this.dragState = DragState.Idle;
    this.dragStart = new Vector2(0, 0);
    if (currentDragState === DragState.Dragging) {
      const detail = { pointerEvent: event };
      if (this.onDragEnd) {
        this.onDragEnd(detail);
      } else {
        dragHandle.dispatchEvent(new CustomEvent("drag-end", { detail }));
      }
    } else {
      const detail = { pointerEvent: event };
      if (this.onDragCancel) {
        this.onDragCancel(detail);
      } else {
        dragHandle.dispatchEvent(new CustomEvent("drag-cancel", { detail }));
      }
    }
  }
}
