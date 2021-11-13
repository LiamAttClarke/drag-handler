import { Vector2 } from "@liamattclarke/vector-n";
import { DragEventHandler, DragHandlerOptions, DragState } from "./types";
export default class DragHandler {
    dragHandles: Element[];
    dragState: DragState;
    dragStartThreshold: number;
    dragStart: Vector2;
    dragOffset: Vector2;
    onDragGrab?: DragEventHandler;
    onDragStart?: DragEventHandler;
    onDragMove?: DragEventHandler;
    onDragEnd?: DragEventHandler;
    onDragCancel?: DragEventHandler;
    constructor(dragHandles: Element | Element[], options: DragHandlerOptions);
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
}
//# sourceMappingURL=DragHandler.d.ts.map