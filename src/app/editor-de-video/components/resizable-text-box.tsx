"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ResizableTextBoxProps {
  widthPct: number;
  heightPx: number;
  isSelected: boolean;
  editable?: boolean;
  text?: string;
  onTextChange?: (next: string) => void;
  onSelect: () => void;
  onResize: (next: { widthPct: number; heightPx: number }) => void;
  children: React.ReactNode;
}

const MIN_WIDTH = 40;
const MAX_WIDTH = 100;
const MIN_HEIGHT = 60;
const MAX_HEIGHT = 700;

export function ResizableTextBox({ widthPct, heightPx, isSelected, editable = false, text, onTextChange, onSelect, onResize, children }: ResizableTextBoxProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const resizeState = useRef<{ type: 'width' | 'height' | 'both' | null; startX: number; startY: number; startWidth: number; startHeight: number; parentWidth: number }>(
    { type: null, startX: 0, startY: 0, startWidth: widthPct, startHeight: heightPx || MIN_HEIGHT, parentWidth: 0 }
  );
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    resizeState.current.startWidth = widthPct;
    resizeState.current.startHeight = heightPx || MIN_HEIGHT;
  }, [widthPct, heightPx]);

  useEffect(() => {
    if (!editable || !editableRef.current || text === undefined) return;
    if (editableRef.current.textContent !== text) {
      editableRef.current.textContent = text;
    }
  }, [editable, text]);

  const clampWidth = useCallback((value: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value)), []);
  const clampHeight = useCallback((value: number) => Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, value)), []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!wrapperRef.current) return;
    const { type, startX, startY, startWidth, startHeight, parentWidth } = resizeState.current;
    if (!type) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    let nextWidth = startWidth;
    let nextHeight = startHeight;

    if (type === 'width' || type === 'both') {
      nextWidth = clampWidth(((startWidth / 100) * parentWidth + deltaX) / parentWidth * 100);
    }
    if (type === 'height' || type === 'both') {
      nextHeight = clampHeight(startHeight + deltaY);
    }

    onResize({ widthPct: nextWidth, heightPx: nextHeight });
  }, [clampHeight, clampWidth, onResize]);

  const handlePointerUp = useCallback(() => {
    setIsResizing(false);
    resizeState.current.type = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const startResize = useCallback((type: 'width' | 'height' | 'both') => (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!wrapperRef.current) return;
    const parentWidth = wrapperRef.current.parentElement?.getBoundingClientRect().width || wrapperRef.current.getBoundingClientRect().width;

    resizeState.current = {
      type,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: widthPct,
      startHeight: heightPx || wrapperRef.current.getBoundingClientRect().height,
      parentWidth,
    };

    setIsResizing(true);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove, handlePointerUp, widthPct, heightPx]);

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
      className="relative mx-auto"
      style={wrapperStyle}
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
            style={{ width: '100%', textAlign: 'left' }}
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
            className="absolute left-0 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg cursor-nwse-resize"
            onPointerDown={startResize('both')}
          />
          <div
            className="absolute right-0 top-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg cursor-nwse-resize"
            onPointerDown={startResize('both')}
          />
          <div
            className="absolute left-0 bottom-0 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary shadow-lg cursor-nwse-resize"
            onPointerDown={startResize('both')}
          />
          <div
            className="absolute right-0 bottom-0 h-4 w-4 translate-x-1/2 translate-y-1/2 rounded-full bg-primary shadow-lg cursor-nwse-resize"
            onPointerDown={startResize('both')}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-lg cursor-ew-resize"
            onPointerDown={startResize('width')}
          />
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 translate-x-1/2 rounded-full bg-primary shadow-lg cursor-ew-resize"
            onPointerDown={startResize('width')}
          />
        </>
      )}
      {isResizing && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none" />
      )}
    </div>
  );
}
