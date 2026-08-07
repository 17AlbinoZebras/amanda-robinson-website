'use client'
import React, { CSSProperties } from 'react'

import { ClippedVector, SizeValue } from './mask_functions';

import styles from './styles/sliders.module.css'

type OrbProps = {
    size: string;
    className?: string; // per-instance styling — e.g. a drop shadow on one, a stroke on another
    style?: CSSProperties;
    strokeWidth?: SizeValue; // plain pixel value — a uniform outline, see ClippedVector's strokeWidth
    strokeColor?: string;
};

type MaskProps = {
    shapeColor?: string;
    src: string;
    maskColor: string;
    maskSize?: string;
    top?: SizeValue;
    right?: SizeValue;
    bottom?: SizeValue;
    left?: SizeValue;
    repeat?: boolean | "x" | "y";
};

const sliderPaths = {
    red: "/masks/Red-Squiggles.svg",
    yellow: "/masks/Yellow-Memphis.svg",
    green: "/masks/Green-Memphis.svg",
    blue: "/masks/Blue-Squiggles.svg"
}

// Calibrated by eye at three (Idiqlat, New Amsterdam) px sizes: (128, 512/3) and
// (96, 352/3) from the 96pt/128pt and 72pt/88pt pairs, plus (50, 65). The slope
// between the first two (5/3) doesn't match the slope down to the third (157/138)
// — New Amsterdam needs proportionally less of a boost at smaller sizes — so this
// is two line segments, each exact through its pair of points and joined
// continuously at Idiqlat=96px, rather than one line forced through all three.
// Below 50px / above 128px, each segment just continues its own slope.
function newAmsterdamFontSize(idiqlatPx: number): number {
  return idiqlatPx <= 96
    ? (157 / 138) * idiqlatPx + 560 / 69  // fits (50, 65) and (96, 352/3)
    : (5 / 3) * idiqlatPx - 128 / 3       // fits (96, 352/3) and (128, 512/3)
}

export const sliderColors = {
    red: {base: "var(--main-red)", mask: "var(--main-blue)", outline: "#B4CAC1", label: "#FFB2B3"},
    yellow: {base: "var(--main-yellow)", mask: "var(--main-red)", outline: "var(--main-light)", label: "#F5DFB4"},
    // For green and blue sliderRects, swap base and label colors
    green: {base: "var(--main-green)", mask: "var(--main-light)", outline: "#A9ACD6", label: "#A6BFB8"},
    blue: {base: "var(--main-blue)", mask: "#FFE8BA", outline: "#FFB2B3", label: "#A9ACD6"}
}

// ORBS

function Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor, src, maskColor, ...vectorProps}}: {orbProps: OrbProps, maskProps: MaskProps}) {
    return (
        <ClippedVector
            shape="circle(50% at 50% 50%)"
            shapeColor={shapeColor}
            frameWidth={size}
            frameHeight={size}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            src={src}
            color={maskColor}
            frameClassName={className}
            frameStyle={style}
            {...vectorProps}
        />
    )
}

export function RedOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.red
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.red, maskColor: colors.mask, maskSize: "130%", left: "-15%", bottom: "0%" }})
}

export function YellowOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.yellow
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.yellow, maskColor: colors.mask, maskSize: "125%" }})
}

export function GreenOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.green
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.green, maskColor: colors.mask, maskSize: "128.5%", left: "-4%", bottom: "-7.5%" }})
}

export function BlueOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.blue
    // repeat intentionally omitted — the orb stays as-is even when the rect tiles.
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: { shapeColor: colors.base, src: sliderPaths.blue, maskColor: colors.mask, maskSize: "150%" }})
}

type RectProps = {
    width: string;
    height: string;
    className?: string;
    style?: CSSProperties;
    strokeWidth?: SizeValue; // plain pixel value — a uniform outline, see ClippedVector's strokeWidth
    strokeColor?: string;
};

type LabelProps = {
    labelText?: string;
    labelStyle?: CSSProperties;
}

// RECTANGLES
function SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor, src, maskColor, ...vectorProps}}: {rectProps: RectProps, maskProps: MaskProps}) {
    return (
        <div className={styles.sliderRect}>
            <ClippedVector
                shape="inset(0)"
                shapeColor={shapeColor}
                frameWidth={width}
                frameHeight={height}
                strokeWidth={strokeWidth}
                strokeColor={strokeColor}
                src={src}
                color={maskColor}
                frameClassName={className}
                frameStyle={style}
                {...vectorProps}
            />
        </div>
    )
}

export function RedSliderRect({width, height, className, style, strokeWidth, strokeColor}: RectProps) {
    const colors = sliderColors.red
    return SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.red, maskColor: colors.mask}})
}

export function YellowSliderRect({width, height, className, style, strokeWidth, strokeColor}: RectProps) {
    const colors = sliderColors.yellow
    return SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.yellow, maskColor: colors.mask}})
}

export function GreenSliderRect({width, height, className, style, strokeWidth, strokeColor}: RectProps) {
    const colors = sliderColors.green
    return SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.label, src: sliderPaths.green, maskColor: colors.mask, maskSize: "105%"}})
}

export function BlueSliderRect({width, height, className, style, strokeWidth, strokeColor}: RectProps) {
    const colors = sliderColors.blue
    // repeat: "x" is baked in here — a fixed characteristic of this rect's own look,
    // same as maskSize is for the orbs above, not something callers configure.
    return SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.label, src: sliderPaths.blue, maskColor: colors.mask, maskSize: "100%", repeat: "x"}})
}


function Slider(width: string, height: string, rect: any, orb: any, orbSide: string, orbStrokeWidth: number, { labelText, labelStyle }: LabelProps) {
    // split string after last number digit
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    // heightParts[0] is the number
    const heightVal = parseFloat(heightParts[0])
    // heightParts[1] is the units
    const heightUnits = heightParts[1]
    const labelHeight = (heightVal*0.8)
    const baseFontHeight = (labelHeight*0.325) // calibrated for Idiqlat; New Amsterdam is derived from this below
    const fontHeight = labelStyle?.fontFamily === "var(--font-new-amsterdam)"
        ? newAmsterdamFontSize(baseFontHeight)
        : baseFontHeight
    const labelStyles = {
        ...labelStyle,
        width: width,
        height: labelHeight + heightUnits,
        fontSize: fontHeight + heightUnits,
        top: heightVal * 0.15
    }
    
    const widthVal = parseFloat(width.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)[0])
    const orbRadius = heightVal/2
    // position the center of the circle at the edge of the slider rectangle
    let orbPosition = 0 - orbRadius
    let labelTextMargin = orbRadius
    if (orbSide === "right") {
        orbPosition += widthVal
        labelTextMargin = 0
    }
    // The orb's stroke grows its box by orbStrokeWidth on every side without moving
    // where its left edge is anchored, which shifts its visual center by that same
    // amount. Shifting the anchor left by orbStrokeWidth keeps the center in place
    // regardless of which edge (left/right) it's centered on.
    orbPosition -= orbStrokeWidth

    return (
        <div>
            <div style={{position: "absolute"}}>{rect}</div>
            <div className={styles.sliderLabel} style={labelStyles}>
                <span className={styles.sliderLabelText} style={{width: (widthVal - orbRadius - orbStrokeWidth + heightUnits), left: labelTextMargin}}>{labelText}</span>
            </div>
            <div style={{position: "absolute", left: orbPosition + heightUnits}}>{orb}</div>
        </div>
    )
}

export function RedSlider({width, height, className, style}: RectProps) {
    const colors = sliderColors.red
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    // heightParts[0] is the number
    const heightVal = parseFloat(heightParts[0])
    // heightParts[1] is the units
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = strokeSizeVal + heightUnits

    // The rect only wants a stroke on its top/bottom edges (not the sides), which a
    // plain border on the unclipped outer wrapper handles directly — no need for
    // ClippedVector's general (all-sides) strokeWidth/strokeColor mechanism here.
    const rect = RedSliderRect({
        width, height, className,
        // boxSizing: "content-box" overrides the global border-box reset for just this
        // element, so the border adds onto the outside of width/height (400x200 stays
        // the full pattern area) instead of eating into it.
        style: {
            ...style,
            boxSizing: "content-box",
            borderTop: `${strokeSize} solid ${colors.outline}`,
            borderBottom: `${strokeSize} solid ${colors.outline}`,
        },
    })
    const orb = RedOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})
    return Slider(width, height, rect, orb, "right", strokeSizeVal, {labelText: "Projects", labelStyle: {fontFamily: "var(--font-new-amsterdam)", color: colors.mask, backgroundColor: colors.label}})
}

export function YellowSlider({width, height, className, style}: RectProps) {
    const colors = sliderColors.yellow
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = strokeSizeVal + heightUnits

    const rect = YellowSliderRect({
        width, height, className,
        style: {
            ...style,
            boxSizing: "content-box",
            borderTop: `${strokeSize} solid ${colors.outline}`,
            borderBottom: `${strokeSize} solid ${colors.outline}`,
        },
    })
    const orb = YellowOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})
    return Slider(width, height, rect, orb, "left", strokeSizeVal, {labelText: "About Me", labelStyle: {fontFamily: "var(--font-idiqlat)", color: colors.mask, backgroundColor: colors.label}})
}

export function GreenSlider({width, height, className, style}: RectProps) {
    const colors = sliderColors.green
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = strokeSizeVal + heightUnits

    const rect = GreenSliderRect({
        width, height, className,
        style: {
            ...style,
            boxSizing: "content-box",
            borderTop: `${strokeSize} solid ${colors.outline}`,
            borderBottom: `${strokeSize} solid ${colors.outline}`,
        },
    })
    const orb = GreenOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})
    return Slider(width, height, rect, orb, "right", strokeSizeVal, {labelText: "Experience", labelStyle: {fontFamily: "var(--font-idiqlat)", color: colors.mask, backgroundColor: colors.base}})
}

export function BlueSlider({width, height, className, style}: RectProps) {
    const colors = sliderColors.blue
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = strokeSizeVal + heightUnits

    const rect = BlueSliderRect({
        width, height, className,
        style: {
            ...style,
            boxSizing: "content-box",
            borderTop: `${strokeSize} solid ${colors.outline}`,
            borderBottom: `${strokeSize} solid ${colors.outline}`,
        },
    })
    const orb = BlueOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})
    return Slider(width, height, rect, orb, "left", strokeSizeVal, {labelText: "Education", labelStyle: {fontFamily: "var(--font-new-amsterdam)", color: colors.mask, backgroundColor: colors.base}})
}