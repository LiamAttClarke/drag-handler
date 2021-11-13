import { Vector2 } from "@liamattclarke/vector-n";
export declare enum DragState {
    Idle = 0,
    Holding = 1,
    Dragging = 2
}
export declare type DragEvent = {
    pointerEvent: PointerEvent;
    dragStart?: Vector2;
    dragOffset?: Vector2;
    dragOffsetDelta?: Vector2;
};
export interface DragEventHandler {
    (detail: DragEvent): void;
}
export declare type DragHandlerOptions = {
    dragStartThreshold?: number;
    onDragGrab?: DragEventHandler;
    onDragStart?: DragEventHandler;
    onDragMove?: DragEventHandler;
    onDragEnd?: DragEventHandler;
    onDragCancel?: DragEventHandler;
};
//# sourceMappingURL=types.d.ts.map