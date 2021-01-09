import Vector2 from './Vector2';

export const DragState = {
  Idle: 0,
  Holding: 1,
  Dragging: 2,
};

export default class DragHandler {
  constructor(dragHandles, {
    dragStartThreshold = 5,
    onDragGrab,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel,
  } = {}) {
    this.dragHandles = dragHandles instanceof Array ? dragHandles : [dragHandles];
    this.dragState = DragState.Idle;
    this.dragStartThreshold = dragStartThreshold;
    this.dragStart = null;
    this.dragOffset = null;
    this.dragHandles.forEach((dragHandle) => {
      dragHandle.addEventListener('pointerdown', this.onPointerDown.bind(this));
      dragHandle.addEventListener('pointermove', this.onPointerMove.bind(this));
      dragHandle.addEventListener('pointerup', this.onPointerUp.bind(this));
    });
    this.onDragGrab = onDragGrab;
    this.onDragStart = onDragStart;
    this.onDragMove = onDragMove;
    this.onDragEnd = onDragEnd;
    this.onDragCancel = onDragCancel;
  }

  onPointerDown(event) {
    // Reject non-primary mouse buttons (usually left-click)
    if (event.button > 0) return;
    const dragHandle = event.currentTarget;
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

  onPointerMove(event) {
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

  onPointerUp(event) {
    // Reject non-primary mouse buttons (usually left-click)
    if (event.button > 0) return;
    const dragHandle = event.currentTarget;
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
