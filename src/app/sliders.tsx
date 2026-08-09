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
    // Applied to the tinted vector itself — sets --mask-size/--mask-position/
    // --mask-repeat via CSS (see the .orbRed/.rectGreen-style classes in
    // sliders.module.css) instead of computing them as inline styles.
    maskClassName?: string;
};

const sliderPaths = {
    red: "/masks/Red-Squiggles.svg",
    yellow: "/masks/Yellow-Memphis.svg",
    green: "/masks/Green-Memphis.svg",
    blue: "/masks/Blue-Squiggles.svg"
}

export const sliderColors = {
    red: {base: "var(--main-red)", mask: "var(--main-blue)", outline: "#B4CAC1", label: "#FFB2B3"},
    yellow: {base: "var(--main-yellow)", mask: "var(--main-red)", outline: "var(--main-light)", label: "#FFE8BA"},
    // For green and blue sliderRects, swap base and label colors
    green: {base: "var(--main-green)", mask: "var(--main-light)", outline: "#A9ACD6", label: "#A6BFB8"},
    blue: {base: "var(--main-blue)", mask: "#FFE8BA", outline: "#FFB2B3", label: "#A9ACD6"}
}

// ORBS

function Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor, src, maskColor, maskClassName}}: {orbProps: OrbProps, maskProps: MaskProps}) {
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
            className={maskClassName}
            frameClassName={className}
            frameStyle={style}
        />
    )
}

export function RedOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.red
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.red, maskColor: colors.mask, maskClassName: styles.orbRed}})
}

export function YellowOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.yellow
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.yellow, maskColor: colors.mask, maskClassName: styles.orbYellow}})
}

export function GreenOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.green
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.green, maskColor: colors.mask, maskClassName: styles.orbGreen}})
}

export function BlueOrb({size, className, style, strokeWidth, strokeColor}: OrbProps) {
    const colors = sliderColors.blue
    // repeat intentionally omitted — the orb stays as-is even when the rect tiles.
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.base, src: sliderPaths.blue, maskColor: colors.mask, maskClassName: styles.orbBlue}})
}

type RectProps = {
    width: string;
    height: string;
    className?: string;
    style?: CSSProperties;
    strokeWidth?: SizeValue; // plain pixel value — a uniform outline, see ClippedVector's strokeWidth
    strokeColor?: string;
};

// RECTANGLES
function SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor, src, maskColor, maskClassName}}: {rectProps: RectProps, maskProps: MaskProps}) {
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
                className={maskClassName}
                frameClassName={className}
                frameStyle={style}
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
    return SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.label, src: sliderPaths.green, maskColor: colors.mask, maskClassName: styles.rectGreen}})
}

export function BlueSliderRect({width, height, className, style, strokeWidth, strokeColor}: RectProps) {
    const colors = sliderColors.blue
    // repeat-x is baked into .rectBlue — a fixed characteristic of this rect's own
    // look, same as maskSize is for the orbs above, not something callers configure.
    return SliderRect({rectProps: {width, height, className, style, strokeWidth, strokeColor}, maskProps: {shapeColor: colors.label, src: sliderPaths.blue, maskColor: colors.mask, maskClassName: styles.rectBlue}})
}


type SliderProps = {
    width: string;
    height: string;
    className?: string;
    style?: CSSProperties;
    strokeWidth?: SizeValue;
    strokeColor?: string;
    sliderClassName?: string;
    sliderStyle?: CSSProperties;
};

type LabelProps = {
    labelText?: string;
    labelStyle?: CSSProperties;
}

function Slider(width: string, height: string, rect: React.ReactNode, orb: React.ReactNode, orbSide: "left" | "right", orbStrokeWidth: SizeValue, { labelText, labelStyle }: LabelProps, sliderClassName?: string, sliderStyle?: CSSProperties) {
    // Custom properties don't get React's automatic px-suffixing for numbers
    // (that only applies to known CSS properties), so a bare number needs "px"
    // appended explicitly here.
    const strokeWidthCss = typeof orbStrokeWidth === "number" ? `${orbStrokeWidth}px` : orbStrokeWidth

    const sliderStyles = {
        ...sliderStyle,
        height,
        width,
        "--stroke-width": strokeWidthCss,
    } as CSSProperties

    const fontClassName = labelStyle?.fontFamily === "var(--font-new-amsterdam)"
        ? styles.labelFontNewAmsterdam
        : styles.labelFontIdiqlat
    const labelSideClassName = orbSide === "left" ? styles.labelOrbLeft : styles.labelOrbRight
    const orbWrapperSideClassName = orbSide === "left" ? styles.orbWrapperLeft : styles.orbWrapperRight

    return (
        <div className={`${styles.slider} ${sliderClassName}`} style={sliderStyles}>
            <div className={styles.rectWrapper}>{rect}</div>
            <div className={`${styles.sliderLabel} ${fontClassName}`} style={labelStyle}>
                <span className={`${styles.sliderLabelText} ${labelSideClassName}`}>{labelText}</span>
            </div>
            <div className={`${styles.orbWrapper} ${orbWrapperSideClassName}`}>{orb}</div>
        </div>
    )
}

export function RedSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle}: SliderProps) {
    const colors = sliderColors.red
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    // heightParts[0] is the number
    const heightVal = parseFloat(heightParts[0])
    // heightParts[1] is the units
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    // The rect only wants a stroke on its top/bottom edges (not the sides), which
    // .sliderBorder (a plain border on the unclipped outer wrapper) handles
    // directly — no need for ClippedVector's general (all-sides) strokeWidth/
    // strokeColor mechanism here.
    const rect = RedSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderRed, className].filter(Boolean).join(" "),
    })
    const orb = RedOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})

    return Slider(width, height, rect, orb, "right", strokeSize, {labelText: "Projects", labelStyle: {fontFamily: "var(--font-new-amsterdam)", color: colors.mask, backgroundColor: colors.label}}, sliderClassName, sliderStyle)
}

export function YellowSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle}: SliderProps) {
    const colors = sliderColors.yellow
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    const rect = YellowSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderYellow, className].filter(Boolean).join(" "),
    })
    const orb = YellowOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})
    return Slider(width, height, rect, orb, "left", strokeSize, {labelText: "About Me", labelStyle: {fontFamily: "var(--font-idiqlat)", color: colors.mask, backgroundColor: colors.label}}, sliderClassName, sliderStyle)
}

export function GreenSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle}: SliderProps) {
    const colors = sliderColors.green
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    const rect = GreenSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderGreen, className].filter(Boolean).join(" "),
    })
    const orb = GreenOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})
    return Slider(width, height, rect, orb, "right", strokeSize, {labelText: "Experience", labelStyle: {fontFamily: "var(--font-idiqlat)", color: colors.mask, backgroundColor: colors.base}}, sliderClassName, sliderStyle)
}

export function BlueSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle}: SliderProps) {
    const colors = sliderColors.blue
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const strokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    const rect = BlueSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderBlue, className].filter(Boolean).join(" "),
    })
    const orb = BlueOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline})
    return Slider(width, height, rect, orb, "left", strokeSize, {labelText: "Education", labelStyle: {fontFamily: "var(--font-new-amsterdam)", color: colors.mask, backgroundColor: colors.base}}, sliderClassName, sliderStyle)
}



type AllSlidersProps = {
    height: string;
    className?: string;
    style?: CSSProperties;
};

// Width isn't a caller-facing concept for the slider group — each slider's rect
// still needs a real pixel width under the hood (ClippedVector's stroke math
// requires one, same reason strokeWidth does — see Slider() above), so it's
// derived from height by this fixed ratio instead of being passed in.
const SLIDER_WIDTH_RATIO = 2

export function AllSliders({height, className, style}: AllSlidersProps) {
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const width = `${heightVal * SLIDER_WIDTH_RATIO}${heightUnits}`

    return (
        <div className={styles.allSliders} style={{height}}>
            <RedSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.topSlider} ${styles.slideLeft}`}/>
            <GreenSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.bottomSlider} ${styles.slideLeft}`}/>
            <YellowSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.topSlider} ${styles.slideRight}`}/>
            <BlueSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.bottomSlider} ${styles.slideRight}`}/>
        </div>
    )
}
