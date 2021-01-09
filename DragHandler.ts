import Vector2 from './Vector2';

export enum DragState {
  Idle = 0,
  Holding = 1,
  Dragging = 2,
}

type DragEvent = {
  pointerEvent: PointerEvent,
  dragStart?: Vector2,
  dragOffset?: Vector2,
  dragOffsetDelta?: Vector2,
}

interface IDragHandler {
  (detail: DragEvent): void;
}

type DragHandlerOptions = {
  dragStartThreshold?: number,
  onDragGrab?: IDragHandler,
  onDragStart?: IDragHandler,
  onDragMove?: IDragHandler,
  onDragEnd?: IDragHandler,
  onDragCancel?: IDragHandler,
} 

const DEFAULT_OPTIONS: DragHandlerOptions = {
  dragStartThreshold: 5,
};

export default class DragHandler {
  dragHandles: Element[];
  dragState: DragState;
  dragStartThreshold: number;
  dragStart: Vector2;
  dragEnd: Vector2;
  dragOffset: Vector2;
  onDragGrab: IDragHandler;
  onDragStart: IDragHandler;
  onDragMove: IDragHandler;
  onDragEnd: IDragHandler;
  onDragCancel: IDragHandler;

  constructor(dragHandles: Element|Element[], options: DragHandlerOptions) {
    const opts: DragHandlerOptions = { ...DEFAULT_OPTIONS, ...options };
    this.dragHandles = dragHandles instanceof Array ? dragHandles : [dragHandles];
    this.dragState = DragState.Idle;
    this.dragStartThreshold = opts.dragStartThreshold;
    this.dragStart = null;
    this.dragOffset = null;
    this.dragHandles.forEach((dragHandle) => {
      dragHandle.addEventListener('pointerdown', this.onPointerDown.bind(this));
      dragHandle.addEventListener('pointermove', this.onPointerMove.bind(this));
      dragHandle.addEventListener('pointerup', this.onPointerUp.bind(this));
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
    const dragHandle = <Element>event.currentTarget;    
    dragHandle.setPointerCapture(event.pointerId);
    this.dragState = DragState.Holding;
    this.dragStart = new Vector2(event.pageX, event.pageY);
    this.dragOffset = new Vector2();
    const detail = { pointerEvent: event, dragStart: this.dragStart };
    if (this.onDragGrab) {
      this.onDragGrab(detail);
    } else {
      dragHandle.dispatchEvent(new CustomEvent('drag-grab', { detail }));
    }
  }

  onPointerMove(event: PointerEvent) {
    // Reject non-primary mouse buttons (usually left-click)
    if (event.button > 0) return;
    if (this.dragStart) {
      const dragHandle = event.currentTarget;
      const dragDistance = new Vector2(event.pageX, event.pageY)
        .subtract(this.dragStart)
        .magnitude();
      if (this.dragState === DragState.Holding && dragDistance > this.dragStartThreshold) {
        this.dragState = DragState.Dragging;
        const detail = { pointerEvent: event, dragStart: this.dragStart };
        if (this.onDragStart) {
          this.onDragStart(detail);
        } else {
          dragHandle.dispatchEvent(new CustomEvent('drag-start', { detail }));
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
        } else {
          dragHandle.dispatchEvent(new CustomEvent('drag-move', { detail }));
        }
        this.dragOffset = dragOffset;
      }
    }
  }

  onPointerUp(event: PointerEvent) {
    // Reject non-primary mouse buttons (usually left-click)
    if (event.button > 0) return;
    const dragHandle = <Element>event.currentTarget;
    dragHandle.releasePointerCapture(event.pointerId);
    const currentDragState = this.dragState;
    this.dragState = DragState.Idle;
    this.dragStart = null;
    if (currentDragState === DragState.Dragging) {
      const detail = { pointerEvent: event };
      if (this.onDragEnd) {
        this.onDragEnd(detail);
      } else {
        dragHandle.dispatchEvent(new CustomEvent('drag-end', { detail }));
      }
    } else {
      const detail = { pointerEvent: event };
      if (this.onDragCancel) {
        this.onDragCancel(detail);
      } else {
        dragHandle.dispatchEvent(new CustomEvent('drag-cancel', { detail }));
      }
    }
  }
}
