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
  className?: string;
  style?: CSSProperties; // merge in extra styles, e.g. from clipToShape
};

export function TintedVector({
  src,
  color,
  width,
  height,
  className,
  style,
}: TintedVectorProps) {
  const sizeStyle = resolveVectorStyle(src, width, height);

  return (
    <div
      className={[styles.tinted, className].filter(Boolean).join(" ")}
      style={{
        ...sizeStyle,
        "--tint-color": color,
        "--mask": `url(${src})`,
        ...style,
      } as CSSProperties}
    />
  );
}


// Accepts any valid clip-path value: circle(...), polygon(...), path("M..."), etc.
export function clipToShape(shape: string): CSSProperties {
  return {
    WebkitClipPath: shape,
    clipPath: shape,
  };
}