"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ResizableTextBoxProps {
  widthPct: number;
  heightPx: number;
  fontSize: number;
  isSelected: boolean;
  editable?: boolean;
  text?: string;
  onTextChange?: (next: string) => void;
  onSelect: () => void;
  onResize: (next: { widthPct: number; heightPx: number; fontSize?: number }) => void;
  children: React.ReactNode;
}

type ResizeType = 'width' | 'height' | 'both' | null;
type ResizeDirection = 'nw' | 'ne' | 'sw' | 'se' | 'w' | 'e';

const MIN_WIDTH = 40;
const MAX_WIDTH = 100;
const MIN_HEIGHT = 60;
const MAX_HEIGHT = 700;
const MIN_FONT_SIZE = 0.5;
const MAX_FONT_SIZE = 20;
const FONT_SCALE_SENSITIVITY = 0.002;
const MIN_RESIZE_DELTA = 2;
const FONT_LERP_FACTOR = 0.18;

const isLeftDirection = (direction: ResizeDirection | undefined) => direction === 'nw' || direction === 'sw' || direction === 'w';
const isTopDirection = (direction: ResizeDirection | undefined) => direction === 'nw' || direction === 'ne';

export function ResizableTextBox({ widthPct, heightPx, fontSize, isSelected, editable = false, text, onTextChange, onSelect, onResize, children }: ResizableTextBoxProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pendingPointer = useRef<{ x: number; y: number } | null>(null);
  const resizeState = useRef<{
    type: ResizeType;
    direction?: ResizeDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startFontSize: number;
    currentFontSize: number;
    parentWidth: number;
  }>(
    {
      type: null,
      startX: 0,
      startY: 0,
      startWidth: widthPct,
      startHeight: heightPx || MIN_HEIGHT,
      startFontSize: fontSize,
      currentFontSize: fontSize,
      parentWidth: 0,
    }
  );
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    resizeState.current.startWidth = widthPct;
    resizeState.current.startHeight = heightPx || MIN_HEIGHT;
    resizeState.current.startFontSize = fontSize;
    resizeState.current.currentFontSize = fontSize;
  }, [widthPct, heightPx, fontSize]);

  useEffect(() => {
    if (!editable || !editableRef.current || text === undefined) return;
    if (editableRef.current.textContent !== text) {
      editableRef.current.textContent = text;
    }
  }, [editable, text]);

  const clampWidth = useCallback((value: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value)), []);
  const clampHeight = useCallback((value: number) => Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, value)), []);
  const clampFontSize = useCallback((value: number) => Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, value)), []);

  const getDirectionVector = useCallback((direction: ResizeDirection | undefined) => {
    switch (direction) {
      case 'nw': return { x: -1, y: -1 };
      case 'ne': return { x: 1, y: -1 };
      case 'sw': return { x: -1, y: 1 };
      case 'se': return { x: 1, y: 1 };
      case 'w': return { x: -1, y: 0 };
      case 'e': return { x: 1, y: 0 };
      default: return { x: 1, y: 1 };
    }
  }, []);

  const lerp = useCallback((start: number, end: number, t: number) => start + (end - start) * t, []);

  const performResize = useCallback(() => {
    animationFrameRef.current = null;
    const pointer = pendingPointer.current;
    if (!pointer || !wrapperRef.current) return;

    const { type, direction, startX, startY, startWidth, startHeight, startFontSize, parentWidth } = resizeState.current;
    if (!type) return;

    const deltaX = pointer.x - startX;
    const deltaY = pointer.y - startY;
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < MIN_RESIZE_DELTA) return;

    let nextWidth = startWidth;
    let nextHeight = startHeight;
    let nextFontSize: number | undefined;

    if (type === 'width' || type === 'both') {
      const startWidthPx = (startWidth / 100) * parentWidth;
      const signedDistance = isLeftDirection(direction) ? -deltaX : deltaX;
      const nextWidthPx = Math.max(1, startWidthPx + signedDistance);
      nextWidth = clampWidth((nextWidthPx / parentWidth) * 100);
    }

    if (type === 'height' || type === 'both') {
      const signedDistance = isTopDirection(direction) ? -deltaY : deltaY;
      nextHeight = clampHeight(startHeight + signedDistance);
    }

    if (type === 'both') {
      const directionVector = getDirectionVector(direction);
      const signedDistance = deltaX * directionVector.x + deltaY * directionVector.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (Math.abs(signedDistance) < MIN_RESIZE_DELTA || distance < MIN_RESIZE_DELTA) return;

      const scale = Math.max(0.1, 1 + signedDistance * FONT_SCALE_SENSITIVITY);
      const targetWidth = clampWidth(startWidth * scale);
      const targetHeight = clampHeight(startHeight * scale);
      nextWidth = targetWidth;
      nextHeight = targetHeight;

      const targetFontSize = clampFontSize(startFontSize * scale);
      const currentFontSize = resizeState.current.currentFontSize || startFontSize;
      nextFontSize = clampFontSize(lerp(currentFontSize, targetFontSize, FONT_LERP_FACTOR));
      resizeState.current.currentFontSize = nextFontSize;
    } else if (type === 'width') {
      const signedDistance = isLeftDirection(direction) ? -deltaX : deltaX;
      if (Math.abs(signedDistance) < MIN_RESIZE_DELTA) return;
      const widthScale = Math.max(0.1, 1 + signedDistance * FONT_SCALE_SENSITIVITY);
      nextWidth = clampWidth(startWidth * widthScale);
      nextFontSize = clampFontSize(startFontSize * widthScale);
    } else if (type === 'height') {
      const signedDistance = isTopDirection(direction) ? -deltaY : deltaY;
      if (Math.abs(signedDistance) < MIN_RESIZE_DELTA) return;
      const heightScale = Math.max(0.1, 1 + signedDistance * FONT_SCALE_SENSITIVITY);
      nextHeight = clampHeight(startHeight * heightScale);
      nextFontSize = clampFontSize(startFontSize * heightScale);
    }

    onResize({ widthPct: nextWidth, heightPx: nextHeight, fontSize: nextFontSize });
  }, [clampHeight, clampWidth, clampFontSize, getDirectionVector, isLeftDirection, isTopDirection, lerp, onResize]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    pendingPointer.current = { x: event.clientX, y: event.clientY };
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      performResize();
    });
  }, [performResize]);

  const handlePointerUp = useCallback(() => {
    setIsResizing(false);
    resizeState.current.type = null;
    pendingPointer.current = null;
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const startResize = useCallback((type: 'width' | 'height' | 'both', direction?: ResizeDirection) => (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!wrapperRef.current) return;
    const parentWidth = wrapperRef.current.parentElement?.getBoundingClientRect().width || wrapperRef.current.getBoundingClientRect().width;

    resizeState.current = {
      type,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: widthPct,
      startHeight: heightPx || wrapperRef.current.getBoundingClientRect().height,
      startFontSize: fontSize,
      currentFontSize: fontSize,
      parentWidth,
    };

    setIsResizing(true);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove, handlePointerUp, widthPct, heightPx, fontSize]);

  const wrapperStyle: React.CSSProperties = useMemo(() => ({
    width: `${widthPct}%`,
    minHeight: `${MIN_HEIGHT}px`,
    height: heightPx > 0 ? `${heightPx}px` : 'auto',
    maxWidth: '100%',
  }), [widthPct, heightPx]);

  const handleTextInput = (event: React.FormEvent<HTMLDivElement>) => {
    if (!onTextChange) return;
    onTextChange(event.currentTarget.textContent ?? '');
  };

  return (
    <div
      ref={wrapperRef}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      className="relative"
      style={{ ...wrapperStyle, marginLeft: 0 }}
    >
      <div className="relative">
        {editable ? (
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleTextInput}
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            className="min-h-[1.3em] outline-none"
            style={{ width: '100%', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {children}
          </div>
        ) : (
          <div className="relative">
            {children}
          </div>
        )}
      </div>

      {isSelected && (
        <>
          <div className="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none" />
          <div
            className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-primary shadow-sm cursor-nwse-resize"
            onPointerDown={startResize('both', 'nw')}
          />
          <div
            className="absolute right-0 top-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-primary shadow-sm cursor-nesw-resize"
            onPointerDown={startResize('both', 'ne')}
          />
          <div
            className="absolute left-0 bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full border border-white/90 bg-primary shadow-sm cursor-nesw-resize"
            onPointerDown={startResize('both', 'sw')}
          />
          <div
            className="absolute right-0 bottom-0 h-3 w-3 translate-x-1/2 translate-y-1/2 rounded-full border border-white/90 bg-primary shadow-sm cursor-nwse-resize"
            onPointerDown={startResize('both', 'se')}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-white/90 bg-primary shadow-sm cursor-ew-resize"
            onPointerDown={startResize('width', 'w')}
          />
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 translate-x-1/2 rounded-full border border-white/90 bg-primary shadow-sm cursor-ew-resize"
            onPointerDown={startResize('width', 'e')}
          />
        </>
      )}
      {isResizing && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none" />
      )}
    </div>
  );
}
