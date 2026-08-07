'use client'

import React from "react"

import { CSSProperties } from "react";
import styles from "./styles/mask_functions.module.css";

// Natural size of each mask vector, taken from its SVG viewBox. Needed because
// mask-image has no intrinsic size of its own (unlike <img>), so this is the
// only way to preserve aspect ratio or scale "by percentage" for a vector.
const NATURAL_SIZE: Record<string, { width: number; height: number }> = {
  "/masks/Blob.svg": { width: 1103.39, height: 462.54 },
  "/masks/Blue-Squiggles.svg": { width: 86.43, height: 86.41 },
  "/masks/Green-Memphis.svg": { width: 942.91, height: 469.31 },
  "/masks/Red-Squiggles.svg": { width: 612.01, height: 306.02 },
  "/masks/Yellow-Memphis.svg": { width: 1494, height: 750 },
};

// A plain number is treated as px; "50%" scales off NATURAL_SIZE; any other
// string ("50vh", "3em", "10rem", ...) passes straight through as a CSS length.
export type SizeValue = number | string;

function resolveAxisValue(value: SizeValue, natural: number): string {
  if (typeof value === "number") return `${value}px`;
  if (value.endsWith("%")) return `${(parseFloat(value) / 100) * natural}px`;
  return value;
}

// Builds the width/height (and, when only one axis is given, an aspect-ratio
// to derive the other) needed to size the vector. Deriving via CSS aspect-ratio
// — rather than computing a px number ourselves — is what lets the specified
// axis use any unit (vh, em, ...) and still keep the vector undistorted.
function resolveVectorStyle(
  src: string,
  width: SizeValue | undefined,
  height: SizeValue | undefined
): CSSProperties {
  const natural = NATURAL_SIZE[src];
  if (!natural) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`TintedVector: no NATURAL_SIZE entry for "${src}" — add one so aspect ratio can be resolved.`);
    }
    return {
      width: width !== undefined ? resolveAxisValue(width, 0) : undefined,
      height: height !== undefined ? resolveAxisValue(height, 0) : undefined,
    };
  }

  if (width === undefined && height === undefined) {
    return { width: `${natural.width}px`, height: `${natural.height}px` };
  }
  if (width !== undefined && height !== undefined) {
    return { width: resolveAxisValue(width, natural.width), height: resolveAxisValue(height, natural.height) };
  }

  const aspectRatio = `${natural.width} / ${natural.height}`;
  if (width !== undefined) {
    return { width: resolveAxisValue(width, natural.width), height: "auto", aspectRatio };
  }
  return { height: resolveAxisValue(height as SizeValue, natural.height), width: "auto", aspectRatio };
}

type TintedVectorProps = {
  src: string;      // path to the monochrome SVG, e.g. "/masks/Blob.svg"
  color: string;    // CSS color to tint it
  width?: SizeValue;  // number (px), "50%" of the vector's natural size, or any CSS length ("50vh", "3em", ...)
  height?: SizeValue; // omit either dimension to derive it from the aspect ratio
  // Together these pick which part of the vector shows through the box. maskSize
  // must be bigger than "contain" (e.g. "200%", "cover") for top/left to have room
  // to shift — at the default "contain" the whole vector always fits, nothing to pan.
  maskSize?: SizeValue; // e.g. "200%", "cover" — how much of the vector is shown
  // Which frame dimension maskSize's percentage is computed against — the other
  // axis is then derived from the vector's own aspect ratio (via CSS's "auto"),
  // not scaled independently. "125%" against a non-square vector gives a very
  // different result depending on whether it's 125% of the frame's width or its
  // height, so this has to be explicit. Defaults to "height" since most of these
  // vectors are wider than they are tall — sizing off height keeps that default
  // from immediately overshooting the frame's width.
  maskSizeAxis?: "width" | "height";
  // The size of the shape this vector is clipped to (e.g. a circular frame's
  // bounding box, or a rectangle's own width/height) — each must be a plain pixel
  // value. When given, they do two things: (1) become the vector's own default
  // box size when width/height aren't set, so the mask actually fills the frame
  // instead of a window the size of the vector's natural artwork; and (2) become
  // what a percentage maskSize/position resolves against (so height="200%" means
  // "twice as tall as the frame", and panning stays proportional if the frame is
  // later resized). Without these, maskSize/position fall back to CSS's own
  // box-relative percentage and NATURAL_SIZE respectively.
  frameWidth?: SizeValue;
  frameHeight?: SizeValue;
  // Anchor the vector to any edge of the box, same idea as top/left/right/bottom on
  // an absolutely positioned element. Give at most one of top/bottom and one of
  // left/right — like real absolute positioning, the pair on one axis is a contradiction.
  top?: SizeValue;
  left?: SizeValue;
  right?: SizeValue;
  bottom?: SizeValue;
  className?: string;
  style?: CSSProperties; // merge in extra styles, e.g. from clipToShape
};

// frameSize describes an external container's concrete size, so unlike other
// SizeValue usages it can't defer sizing to CSS — it has to resolve to a real
// number here so maskSize/position percentages can be computed against it.
function parsePixels(value: SizeValue): number | undefined {
  if (typeof value === "number") return value;
  const match = /^(-?[\d.]+)px$/.exec(value.trim());
  return match ? parseFloat(match[1]) : undefined;
}

// mask-position's "right 20px" edge-offset syntax isn't reliably supported across
// browsers (unlike background-position), so a right/bottom value is instead converted
// to the equivalent left/top-relative one via calc() — this only needs the plain,
// universally-supported "<x> <y>" two-value syntax.
function resolveAxisPosition(
  startValue: SizeValue | undefined,
  startName: string,
  endValue: SizeValue | undefined,
  endName: string,
  reference: number
): string {
  if (startValue !== undefined && endValue !== undefined && process.env.NODE_ENV !== "production") {
    console.warn(`TintedVector: both "${startName}" and "${endName}" were given — "${startName}" wins, "${endName}" is ignored.`);
  }
  if (startValue !== undefined) return resolveAxisValue(startValue, reference);
  if (endValue !== undefined) return `calc(100% - ${resolveAxisValue(endValue, reference)})`;
  return "center";
}

export function TintedVector({
  src,
  color,
  width,
  height,
  maskSize,
  maskSizeAxis = "height",
  frameWidth,
  frameHeight,
  top,
  left,
  right,
  bottom,
  className,
  style,
}: TintedVectorProps) {
  const natural = NATURAL_SIZE[src];

  const frameWidthPx = frameWidth !== undefined ? parsePixels(frameWidth) : undefined;
  if (frameWidth !== undefined && frameWidthPx === undefined && process.env.NODE_ENV !== "production") {
    console.warn(`TintedVector: frameWidth must be a plain pixel value (e.g. 300 or "300px"), got "${frameWidth}" — ignoring.`);
  }
  const frameHeightPx = frameHeight !== undefined ? parsePixels(frameHeight) : undefined;
  if (frameHeight !== undefined && frameHeightPx === undefined && process.env.NODE_ENV !== "production") {
    console.warn(`TintedVector: frameHeight must be a plain pixel value (e.g. 300 or "300px"), got "${frameHeight}" — ignoring.`);
  }

  // Default the vector's own box to fill the frame — without this, maskSize/position
  // only ever pan around a window the size of the vector's natural artwork (e.g.
  // 86x86px), regardless of how big the frame actually is, since nothing else ties
  // the box itself to the frame's size.
  const sizeStyle = resolveVectorStyle(
    src,
    width ?? (frameWidthPx !== undefined ? `${frameWidthPx}px` : undefined),
    height ?? (frameHeightPx !== undefined ? `${frameHeightPx}px` : undefined),
  );

  // Resolve maskSize against the frame dimension matching maskSizeAxis when both are
  // given and maskSize is a number/percentage; otherwise fall back to passing it
  // straight through as CSS (native box-relative %, or keywords like "cover"). The
  // chosen axis gets the resolved px value; the other is set via "auto" so the
  // vector's own aspect ratio determines it — both resolvedMaskWidthPx/HeightPx are
  // computed either way so position math below always has real numbers to work with.
  let maskSizeCss: string | undefined;
  let resolvedMaskWidthPx: number | undefined;
  let resolvedMaskHeightPx: number | undefined;
  if (maskSize !== undefined) {
    const framePxForAxis = maskSizeAxis === "height" ? frameHeightPx : frameWidthPx;
    if (framePxForAxis !== undefined && (typeof maskSize === "number" || maskSize.endsWith("%"))) {
      const resolvedPx = typeof maskSize === "number" ? maskSize : (parseFloat(maskSize) / 100) * framePxForAxis;
      const aspectRatio = natural ? natural.width / natural.height : 1;
      if (maskSizeAxis === "height") {
        resolvedMaskHeightPx = resolvedPx;
        resolvedMaskWidthPx = resolvedPx * aspectRatio;
        maskSizeCss = `auto ${resolvedPx}px`;
      } else {
        resolvedMaskWidthPx = resolvedPx;
        resolvedMaskHeightPx = resolvedPx / aspectRatio;
        maskSizeCss = `${resolvedPx}px`;
      }
    } else {
      maskSizeCss = typeof maskSize === "number" ? `${maskSize}px` : maskSize;
    }
  }

  // Position percentages resolve against the vector's real rendered width/height
  // when available (panning relative to how big the vector currently renders),
  // else fall back to NATURAL_SIZE per axis, same as before.
  const xReference = resolvedMaskWidthPx ?? natural?.width ?? 0;
  const yReference = resolvedMaskHeightPx ?? natural?.height ?? 0;
  const xToken = resolveAxisPosition(left, "left", right, "right", xReference);
  const yToken = resolveAxisPosition(top, "top", bottom, "bottom", yReference);
  const maskPosition = (xToken !== "center" || yToken !== "center") ? `${xToken} ${yToken}` : undefined;

  return (
    <div
      className={[styles.tinted, className].filter(Boolean).join(" ")}
      style={{
        ...sizeStyle,
        "--tint-color": color,
        "--mask": `url(${src})`,
        ...(maskSizeCss && { "--mask-size": maskSizeCss }),
        ...(maskPosition && { "--mask-position": maskPosition }),
        ...style,
      } as CSSProperties}
    />
  );
}


// Accepts any valid clip-path value: circle(...), polygon(...), path("M..."), etc.
// backgroundColor is optional — clip-path only cuts the element's visible region,
// it doesn't paint anything, so pass a color here if the element needs one to show through.
export function clipToShape(shape: string, backgroundColor?: string): CSSProperties {
  return {
    WebkitClipPath: shape,
    clipPath: shape,
    ...(backgroundColor && { backgroundColor }),
  };
}

type ClippedVectorProps = Omit<TintedVectorProps, "frameWidth" | "frameHeight"> & {
  // Required here (unlike on TintedVector) — they both size the frame div itself
  // and drive TintedVector's frame-relative maskSize/position math. For a circle
  // or square frame, pass the same value to both.
  frameWidth: SizeValue;
  frameHeight: SizeValue;
  shape: string;        // clip-path for the frame, e.g. "circle(50% at 50% 50%)", "inset(0)" for a plain rectangle
  shapeColor?: string;  // background color of the frame, visible wherever the vector's mask doesn't cover it
  frameClassName?: string; // applied to the outer (unclipped) wrapper — see note on frameStyle below
  // Applied to the outer wrapper, one level above the element that actually has
  // clip-path. Effects like filter: drop-shadow() get clipped away to nothing if
  // they're on the same element as clip-path (verified directly in-browser — the
  // clip is applied after the filter), so a shadow/effect on a clipped shape only
  // renders correctly from a non-clipped ancestor.
  frameStyle?: CSSProperties;
};

// TintedVector + clipToShape are almost always used together as "a colored,
// clipped frame with a tinted vector inside it" (see RedOrb) — but the two can't
// just be combined onto one element (mask-image and the frame's own background
// color would fight over the same CSS property, see clipToShape's docs above).
// This wraps the two-element pattern that actually works: an outer clipped/colored
// frame, with the vector nested inside it. It's actually two nested wrappers, not
// one — see frameStyle above for why the outer one exists.
export function ClippedVector({
  frameWidth,
  frameHeight,
  shape,
  shapeColor,
  frameClassName,
  frameStyle,
  ...vectorProps
}: ClippedVectorProps) {
  const widthLength = typeof frameWidth === "number" ? `${frameWidth}px` : frameWidth;
  const heightLength = typeof frameHeight === "number" ? `${frameHeight}px` : frameHeight;

  return (
    <div
      className={[styles.frameWrapper, frameClassName].filter(Boolean).join(" ")}
      style={{ width: widthLength, height: heightLength, ...frameStyle }}
    >
      <div
        className={styles.clippedFrame}
        style={{ width: "100%", height: "100%", ...clipToShape(shape, shapeColor) }}
      >
        <TintedVector frameWidth={frameWidth} frameHeight={frameHeight} {...vectorProps} />
      </div>
    </div>
  );
}