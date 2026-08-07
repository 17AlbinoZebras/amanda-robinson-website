'use client'
import React, { CSSProperties } from 'react'

import { ClippedVector, SizeValue } from './mask_functions';

type OrbProps = {
    size: string;
    className?: string; // per-instance styling — e.g. a drop shadow on one, a stroke on another
    style?: CSSProperties;
};

type RectProps = {
    width: string;
    height: string;
    className?: string; // per-instance styling — e.g. a drop shadow on one, a stroke on another
    style?: CSSProperties;
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
};

export const sliderColors = {
    red: {base: "var(--main-red)", mask: "var(--main-blue)", outline: "#B4CAC1"},
    yellow: {base: "var(--main-yellow)", mask: "var(--main-red)", outline: "var(--main-light)"},
    green: {base: "var(--main-green)", mask: "var(--main-light)", outline: "#A9ACD6"},
    blue: {base: "var(--main-blue)", mask: "#FFE8BA", outline: "#FFB2B3"}
}

function Orb({orbProps: {size, className, style}, maskProps: {shapeColor, src, maskColor, ...vectorProps}}: {orbProps: OrbProps, maskProps: MaskProps}) {
    return (
        <ClippedVector
            shape="circle(50% at 50% 50%)"
            shapeColor={shapeColor}
            frameWidth={size}
            frameHeight={size}
            src={src}
            color={maskColor}
            frameClassName={className}
            frameStyle={style}
            {...vectorProps}
        />
    )
}

function SliderRect({rectProps: {width, height, className, style}, maskProps: {shapeColor, src, maskColor, ...vectorProps}}: {rectProps: RectProps, maskProps: MaskProps}) {
    return (
        <ClippedVector
            shape="inset(0)"
            shapeColor={shapeColor}
            frameWidth={width}
            frameHeight={height}
            src={src}
            color={maskColor}
            frameClassName={className}
            frameStyle={style}
            {...vectorProps}
        />
    )
}

export function RedOrb({size, className, style}: OrbProps) {
    const colors = sliderColors.red
    return Orb({orbProps: {size, className, style}, maskProps: {shapeColor: colors.base, src: "/masks/Red-Squiggles.svg", maskColor: colors.mask, maskSize: "130%", left: "-15%", bottom: "0%" }})
}

export function YellowOrb({size, className, style}: OrbProps) {
    const colors = sliderColors.yellow
    return Orb({orbProps: {size, className, style}, maskProps: {shapeColor: colors.base, src: "/masks/Yellow-Memphis.svg", maskColor: colors.mask, maskSize: "125%" }})
}

export function GreenOrb({size, className, style}: OrbProps) {
    const colors = sliderColors.green
    return Orb({orbProps: {size, className, style}, maskProps: {shapeColor: colors.base, src: "/masks/Green-Memphis.svg", maskColor: colors.mask, maskSize: "128.5%", left: "-4%", bottom: "-7.5%" }})
}

export function BlueOrb({size, className, style}: OrbProps) {
    const colors = sliderColors.blue
    return Orb({orbProps: {size, className, style}, maskProps: { shapeColor: colors.base, src: "/masks/Blue-Squiggles.svg", maskColor: colors.mask, maskSize: "150%" }})
}