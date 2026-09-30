"use client";

import { useEffect, useRef } from "react";

const CHARS = "01アイウエオカキクケコサシスセソタチツテトABCDEF89";
const CELL = 18;
const RADIUS = 88;
const SPOT_FONT = `600 ${CELL - 5}px ui-monospace, SFMono-Regular, monospace`;
const FILLS = [
  "rgba(76, 29, 149, 0.5)",
  "rgba(76, 29, 149, 0.68)",
  "rgba(76, 29, 149, 0.84)",
];

export function CyberMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const hostEl = canvasEl?.parentElement;
    if (!canvasEl || !hostEl) return;

    const renderCtx = canvasEl.getContext("2d", { alpha: true });
    if (!renderCtx) return;

    const backdrop = document.createElement("canvas");
    const backdropCtx = backdrop.getContext("2d", { alpha: true });
    if (!backdropCtx) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const host: HTMLElement = hostEl;
    const ctx: CanvasRenderingContext2D = renderCtx;
    const back: CanvasRenderingContext2D = backdropCtx;

    const widthQuery = window.matchMedia("(max-width: 767px)");
    let mobile = widthQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let grid: string[][] = [];
    let hostRect = host.getBoundingClientRect();
    const target = { x: -9999, y: -9999 };
    const spot = { x: -9999, y: -9999 };
    const prev = { x: -9999, y: -9999 };
    let frame = 0;
    let following = false;
    let hasBase = false;

    function randomChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)] ?? "0";
    }

    function buildGrid() {
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => randomChar()),
      );
    }

    function drawBackdrop() {
      back.setTransform(dpr, 0, 0, dpr, 0, 0);
      back.clearRect(0, 0, width, height);
      back.font = `500 ${CELL - 6}px ui-monospace, SFMono-Regular, monospace`;
      back.textAlign = "center";
      back.textBaseline = "middle";
      back.fillStyle = "rgba(139, 92, 246, 0.055)";
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          back.fillText(
            grid[row]?.[col] ?? "0",
            col * CELL + CELL / 2,
            row * CELL + CELL / 2,
          );
        }
      }
    }

    function blitPatch(x: number, y: number) {
      if (x < 0) return;
      const pad = RADIUS + CELL;
      const left = Math.max(0, x - pad);
      const top = Math.max(0, y - pad);
      const right = Math.min(width, x + pad);
      const bottom = Math.min(height, y + pad);
      const w = right - left;
      const h = bottom - top;
      if (w <= 0 || h <= 0) return;

      ctx.clearRect(left * dpr, top * dpr, w * dpr, h * dpr);
      ctx.drawImage(
        backdrop,
        left * dpr,
        top * dpr,
        w * dpr,
        h * dpr,
        left * dpr,
        top * dpr,
        w * dpr,
        h * dpr,
      );
    }

    function paint() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (!hasBase) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backdrop, 0, 0);
        hasBase = true;
      } else {
        blitPatch(prev.x, prev.y);
      }

      prev.x = spot.x;
      prev.y = spot.y;
      if (mobile || spot.x < 0) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = SPOT_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const minCol = Math.max(0, Math.floor((spot.x - RADIUS) / CELL));
      const maxCol = Math.min(cols - 1, Math.ceil((spot.x + RADIUS) / CELL));
      const minRow = Math.max(0, Math.floor((spot.y - RADIUS) / CELL));
      const maxRow = Math.min(rows - 1, Math.ceil((spot.y + RADIUS) / CELL));
      let fillIndex = -1;

      for (let row = minRow; row <= maxRow; row += 1) {
        for (let col = minCol; col <= maxCol; col += 1) {
          const x = col * CELL + CELL / 2;
          const y = row * CELL + CELL / 2;
          const dist = Math.hypot(x - spot.x, y - spot.y);
          const intensity = 1 - dist / RADIUS;
          if (intensity < 0.08) continue;

          const nextFill = intensity > 0.72 ? 2 : intensity > 0.4 ? 1 : 0;
          if (nextFill !== fillIndex) {
            fillIndex = nextFill;
            ctx.fillStyle = FILLS[nextFill] ?? FILLS[0];
          }
          ctx.fillText(grid[row]?.[col] ?? "0", x, y);
        }
      }
    }

    function follow() {
      if (target.x < 0) {
        spot.x = -9999;
        spot.y = -9999;
        paint();
        following = false;
        return;
      }

      if (spot.x < 0) {
        spot.x = target.x;
        spot.y = target.y;
      } else {
        spot.x += (target.x - spot.x) * 0.16;
        spot.y += (target.y - spot.y) * 0.16;
      }

      paint();

      const lag = Math.hypot(target.x - spot.x, target.y - spot.y);
      if (lag > 0.8) {
        frame = requestAnimationFrame(follow);
        return;
      }

      spot.x = target.x;
      spot.y = target.y;
      following = false;
    }

    function schedule() {
      if (following) return;
      following = true;
      frame = requestAnimationFrame(follow);
    }

    function resize() {
      hostRect = host.getBoundingClientRect();
      const nextWidth = hostRect.width;
      const nextHeight = hostRect.height;
      if (nextWidth === width && nextHeight === height && grid.length > 0) {
        return;
      }

      dpr = 1;
      width = nextWidth;
      height = nextHeight;
      const pixelWidth = Math.max(1, Math.floor(width));
      const pixelHeight = Math.max(1, Math.floor(height));
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      backdrop.width = pixelWidth;
      backdrop.height = pixelHeight;
      hasBase = false;
      prev.x = -9999;
      prev.y = -9999;
      buildGrid();
      drawBackdrop();
      paint();
    }

    function onMove(event: PointerEvent) {
      if (mobile) return;
      const inside =
        event.clientX >= hostRect.left &&
        event.clientX <= hostRect.right &&
        event.clientY >= hostRect.top &&
        event.clientY <= hostRect.bottom;

      const nextX = inside ? event.clientX - hostRect.left : -9999;
      const nextY = inside ? event.clientY - hostRect.top : -9999;
      if (nextX === target.x && nextY === target.y) return;
      target.x = nextX;
      target.y = nextY;
      schedule();
    }

    function onScroll() {
      hostRect = host.getBoundingClientRect();
    }

    function onWidthChange() {
      mobile = widthQuery.matches;
      target.x = -9999;
      target.y = -9999;
      spot.x = -9999;
      spot.y = -9999;
      width = 0;
      height = 0;
      resize();
    }

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    widthQuery.addEventListener("change", onWidthChange);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      widthQuery.removeEventListener("change", onWidthChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
