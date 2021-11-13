"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vector_n_1 = require("@liamattclarke/vector-n");
var types_1 = require("./types");
var DEFAULT_OPTIONS = {
    dragStartThreshold: 5,
};
var DragHandler = (function () {
    function DragHandler(dragHandles, options) {
        var _this = this;
        this.dragStart = new vector_n_1.Vector2(0, 0);
        this.dragOffset = new vector_n_1.Vector2(0, 0);
        var opts = __assign(__assign({}, DEFAULT_OPTIONS), options);
        this.dragHandles = dragHandles instanceof Array ? dragHandles : [dragHandles];
        this.dragState = types_1.DragState.Idle;
        this.dragStartThreshold = opts.dragStartThreshold || 0;
        this.dragHandles.forEach(function (dragHandle) {
            dragHandle.addEventListener("pointerdown", function (e) { return _this.onPointerDown(e); });
            dragHandle.addEventListener("pointermove", function (e) { return _this.onPointerMove(e); });
            dragHandle.addEventListener("pointerup", function (e) { return _this.onPointerUp(e); });
        });
        this.onDragGrab = opts.onDragGrab;
        this.onDragStart = opts.onDragStart;
        this.onDragMove = opts.onDragMove;
        this.onDragEnd = opts.onDragEnd;
        this.onDragCancel = opts.onDragCancel;
    }
    DragHandler.prototype.onPointerDown = function (event) {
        if (event.button > 0)
            return;
        var dragHandle = event.currentTarget;
        dragHandle.setPointerCapture(event.pointerId);
        this.dragState = types_1.DragState.Holding;
        this.dragStart = new vector_n_1.Vector2(event.pageX, event.pageY);
        this.dragOffset = new vector_n_1.Vector2(0, 0);
        var detail = { pointerEvent: event, dragStart: this.dragStart };
        if (this.onDragGrab) {
            this.onDragGrab(detail);
        }
        else {
            dragHandle.dispatchEvent(new CustomEvent("drag-grab", { detail: detail }));
        }
    };
    DragHandler.prototype.onPointerMove = function (event) {
        if (event.button > 0)
            return;
        var dragHandle = event.currentTarget;
        var dragDistance = new vector_n_1.Vector2(event.pageX, event.pageY)
            .subtract(this.dragStart)
            .magnitude();
        if (this.dragState === types_1.DragState.Holding && dragDistance > this.dragStartThreshold) {
            this.dragState = types_1.DragState.Dragging;
            var detail = { pointerEvent: event, dragStart: this.dragStart };
            if (this.onDragStart) {
                this.onDragStart(detail);
            }
            else if (dragHandle) {
                dragHandle.dispatchEvent(new CustomEvent("drag-start", { detail: detail }));
            }
        }
        if (this.dragState === types_1.DragState.Dragging) {
            var dragOffset = new vector_n_1.Vector2(event.pageX, event.pageY).subtract(this.dragStart);
            var detail = {
                pointerEvent: event,
                dragOffset: dragOffset,
                dragOffsetDelta: dragOffset.subtract(this.dragOffset),
            };
            if (this.onDragMove) {
                this.onDragMove(detail);
            }
            else if (dragHandle) {
                dragHandle.dispatchEvent(new CustomEvent("drag-move", { detail: detail }));
            }
            this.dragOffset = dragOffset;
        }
    };
    DragHandler.prototype.onPointerUp = function (event) {
        if (event.button > 0)
            return;
        var dragHandle = event.currentTarget;
        dragHandle.releasePointerCapture(event.pointerId);
        var currentDragState = this.dragState;
        this.dragState = types_1.DragState.Idle;
        this.dragStart = new vector_n_1.Vector2(0, 0);
        if (currentDragState === types_1.DragState.Dragging) {
            var detail = { pointerEvent: event };
            if (this.onDragEnd) {
                this.onDragEnd(detail);
            }
            else {
                dragHandle.dispatchEvent(new CustomEvent("drag-end", { detail: detail }));
            }
        }
        else {
            var detail = { pointerEvent: event };
            if (this.onDragCancel) {
                this.onDragCancel(detail);
            }
            else {
                dragHandle.dispatchEvent(new CustomEvent("drag-cancel", { detail: detail }));
            }
        }
    };
    return DragHandler;
}());
exports.default = DragHandler;
//# sourceMappingURL=DragHandler.js.map