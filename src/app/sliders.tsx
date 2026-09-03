'use client'
import React, { CSSProperties, JSX, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { ClippedVector, SizeValue } from './mask_functions';

import styles from './styles/sliders.module.css'
import { AppStateTypes } from './app_shell';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'

type OrbProps = {
    size: string;
    className?: string; // per-instance styling — e.g. a drop shadow on one, a stroke on another
    style?: CSSProperties;
    strokeWidth?: SizeValue; // plain pixel value — a uniform outline, see ClippedVector's strokeWidth
    strokeColor?: string;
    strokeOpacity?: number; // fades the stroke without affecting strokeWidth's layout impact — see ClippedVector
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
    yellow: {base: "var(--main-yellow)", mask: "var(--main-red)", outline: "#A9ACD6", label: "#FFE8BA"},
    // For green and blue sliderRects, swap base and label colors
    green: {base: "var(--main-green)", mask: "var(--main-light)", outline: "#FCD07D", label: "#A6BFB8"},
    blue: {base: "var(--main-blue)", mask: "#FFE8BA", outline: "#FFB2B3", label: "#A9ACD6"}
}

const sliderIcons = {
    red: fas.faCode,
    yellow: fas.faUser,
    green: fas.faBriefcase,
    blue: fas.faGraduationCap,
    home: fas.faHouse
}

// Pages where every slider's stroke stays visible regardless of hover/open
// state — the home page (where none of the 4 sliders is ever "active", so
// without this none would show a stroke at all) and the resume page
// (requested directly: the sliders sit over .resume's plain, low-contrast
// background there, and were hard to make out unstroked).
const ALWAYS_STROKE_PATHS = ['/', '/resume']

// ORBS

function Orb({orbProps: {size, className, style, strokeWidth, strokeColor, strokeOpacity}, maskProps: {shapeColor, src, maskColor, maskClassName}}: {orbProps: OrbProps, maskProps: MaskProps}) {
    return (
        <ClippedVector
            shape="circle(50% at 50% 50%)"
            shapeColor={shapeColor}
            frameWidth={size}
            frameHeight={size}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            strokeOpacity={strokeOpacity}
            src={src}
            color={maskColor}
            className={maskClassName}
            frameClassName={className}
            frameStyle={style}
        />
    )
}

export function RedOrb({size, className, style, strokeWidth, strokeColor, strokeOpacity}: OrbProps) {
    const colors = sliderColors.red
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor, strokeOpacity}, maskProps: {shapeColor: colors.base, src: sliderPaths.red, maskColor: colors.mask, maskClassName: styles.orbRed}})
}

export function YellowOrb({size, className, style, strokeWidth, strokeColor, strokeOpacity}: OrbProps) {
    const colors = sliderColors.yellow
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor, strokeOpacity}, maskProps: {shapeColor: colors.base, src: sliderPaths.yellow, maskColor: colors.mask, maskClassName: styles.orbYellow}})
}

export function GreenOrb({size, className, style, strokeWidth, strokeColor, strokeOpacity}: OrbProps) {
    const colors = sliderColors.green
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor, strokeOpacity}, maskProps: {shapeColor: colors.base, src: sliderPaths.green, maskColor: colors.mask, maskClassName: styles.orbGreen}})
}

export function BlueOrb({size, className, style, strokeWidth, strokeColor, strokeOpacity}: OrbProps) {
    const colors = sliderColors.blue
    // repeat intentionally omitted — the orb stays as-is even when the rect tiles.
    return Orb({orbProps: {size, className, style, strokeWidth, strokeColor, strokeOpacity}, maskProps: {shapeColor: colors.base, src: sliderPaths.blue, maskColor: colors.mask, maskClassName: styles.orbBlue}})
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
    // The current route (see AppStateTypes in app_shell.tsx) — each slider
    // compares this to its own page to decide whether it's the "active"
    // one (see the isActive logic in RedSlider/YellowSlider/GreenSlider/
    // BlueSlider below).
    pathname: string;
    icon?: JSX.Element;
};

type LabelProps = {
    labelText?: string;
    labelStyle?: CSSProperties;
}

// (hover: hover) is the standards-based way to ask "can this device's
// PRIMARY input mechanism actually hover" — true for mouse/trackpad, false
// for touch, regardless of viewport width (unlike a max-width check: a
// touch tablet in landscape can easily be wider than the site's own mobile
// breakpoint, and would still have no real hover). Used to gate
// onMouseEnter/onMouseLeave entirely on non-hover devices — see the
// hoverHandlers comment in Slider() below for why that's the fix, not just
// a nice-to-have. true first (assumes hover-capable) since there's no
// matchMedia during SSR — matches every other measure-after-mount hook in
// this codebase in spirit, just defaulting toward "don't change existing
// desktop behavior" rather than toward mobile.
// useLayoutEffect (not useEffect) — matches useScaleToFit's own reasoning
// in home_page.tsx: this needs to settle to its real value before the
// FIRST paint a user could conceivably tap during, not just "soon after".
// A useEffect-based correction still runs well before a human can
// physically react to a first frame, but the whole point of this hook is
// closing the exact race it exists to prevent — worth the belt-and-suspenders
// here specifically, even though every other measure-after-mount hook in
// this codebase uses plain useEffect.
function useHoverCapable() {
    const [hoverCapable, setHoverCapable] = useState(true)
    useLayoutEffect(() => {
        const mql = window.matchMedia('(hover: hover)')
        setHoverCapable(mql.matches)
        const handleChange = (e: MediaQueryListEvent) => setHoverCapable(e.matches)
        mql.addEventListener('change', handleChange)
        return () => mql.removeEventListener('change', handleChange)
    }, [])
    return hoverCapable
}

function Slider(width: string, height: string, rect: React.ReactNode, orb: React.ReactNode, orbSide: "left" | "right", orbStrokeWidth: SizeValue, { labelText, labelStyle }: LabelProps, sliderClassName?: string, sliderStyle?: CSSProperties, href?: string, icon?: JSX.Element, isOpen?: boolean, onOpenChange?: (open: boolean) => void, sliderRef?: React.Ref<HTMLAnchorElement>, dockSide?: "left" | "right") {
    const hoverCapable = useHoverCapable()

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
    // .sliderOpen (JS-tracked via onMouseEnter/onMouseLeave below) replaces a
    // plain :hover rule for the slide-in-on-hover look — :hover alone can't
    // be "forced closed" after a navigation, since it just reflects the
    // cursor's real physical position: if a user clicks a slider, the mouse
    // is very likely still resting over that same spot right after the page
    // changes, and a pure :hover rule would keep it open with no way to
    // reset it short of the mouse actually leaving and re-entering. Tracking
    // it as React state instead means it can be reset on navigation (see the
    // key={pathname} remount in AllSliders) regardless of where the cursor
    // physically is, and it only opens again on a genuine new mouseenter.
    const sliderClassNames = `${styles.slider} ${sliderClassName} ${isOpen ? styles.sliderOpen : ''}`

    const content = (
        <>
            <div className={styles.rectWrapper}>{rect}</div>
            <div className={`${styles.sliderLabel} ${fontClassName}`} style={labelStyle}>
                <span className={`${styles.sliderLabelText} ${labelSideClassName}`}>{labelText}</span>
            </div>
            <div className={`${styles.orbWrapper} ${orbWrapperSideClassName}`}>
                {orb}
                {icon}
            </div>
        </>
    )

    // onClick intercepts the FIRST activation while closed and turns it into
    // "just open" instead of "navigate" — necessary for touch, which has no
    // real hover to open the slider before a tap: without this, a tap would
    // both open AND immediately navigate in the same gesture, so a touch
    // user could never actually see the slider before leaving the page. This
    // depends on isOpen genuinely still being false at the start of a tap,
    // which is exactly what hoverCapable (below) guarantees — see its own
    // comment for why that's not as automatic as it sounds on an actual
    // touch device.
    const handleClick = (e: React.MouseEvent) => {
        if (!isOpen) {
            e.preventDefault()
            onOpenChange?.(true)
        }
    }

    // Lets a touch user drag/swipe a slider open OR closed instead of only
    // being able to tap it — matches the "slider" name more literally, and
    // reads as a more natural touch gesture than a tap for something that
    // visually slides. This is pure gesture DETECTION, not a live finger-
    // following drag: rather than continuously updating a transform to track
    // the touch position (which would mean reimplementing the open/closed
    // transform by hand, fighting the existing CSS transition and the
    // hover/.sliderOpen states it already has to agree with), a swipe past a
    // real minimum distance just calls the same onOpenChange(...) a tap (or,
    // for closing, a tap outside — see the pointerdown listener in
    // RedSlider/YellowSlider/etc.) already does — the existing CSS
    // transition still handles the actual animation, so this only ever adds
    // a new way to TRIGGER that same state change, not a second animation
    // system to keep in sync with the first.
    const touchStartRef = useRef<{ x: number; y: number } | null>(null)
    const SWIPE_THRESHOLD = 24

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartRef.current || !dockSide) return
        const dx = e.touches[0].clientX - touchStartRef.current.x
        const dy = e.touches[0].clientY - touchStartRef.current.y
        // Requires the drag to be BOTH past a real minimum distance (so
        // ordinary tap jitter never triggers this) AND more horizontal than
        // vertical (so a vertical page-scroll that happens to start on the
        // slider's own small visible sliver doesn't get hijacked into
        // opening/closing it instead of scrolling).
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return
        // A left-docked slider (off-screen to the left) opens by dragging
        // RIGHTWARD, toward the screen's interior, and closes dragging back
        // LEFTWARD, toward off-screen; a right-docked one is the mirror
        // image throughout. wouldOpen === isOpen means the drag is heading
        // further INTO the current state (e.g. dragging further open while
        // already open) — nothing to change either way, so only a drag that
        // actually crosses toward the OTHER state does anything.
        const isDraggingRight = dx > 0
        const wouldOpen = dockSide === 'left' ? isDraggingRight : !isDraggingRight
        if (wouldOpen === isOpen) return
        e.preventDefault()
        touchStartRef.current = null
        onOpenChange?.(wouldOpen)
    }

    const handleTouchEnd = () => {
        touchStartRef.current = null
    }

    // Mirrors the hover handlers below so keyboard-tab users get the same
    // slide-open reveal a mouse hover gives — without this, Tab landing on a
    // closed slider left it visually off-screen with no way to see what it
    // even was before pressing Enter. Gated to :focus-visible (not every
    // focus) so a mouse click — which also focuses the link — doesn't fire
    // this too; harmless either way since onMouseEnter already opened it by
    // then, but this keeps a click from touching state it doesn't need to.
    // onBlur closes unconditionally, same as onMouseLeave — Tabbing to the
    // next element is the keyboard equivalent of the mouse moving off.
    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
        if (e.currentTarget.matches(':focus-visible')) {
            onOpenChange?.(true)
        }
    }

    // hoverCapable (see its own definition below) gates onMouseEnter/
    // onMouseLeave specifically — not the whole hoverHandlers object, since
    // onFocus/onBlur/onClick all still need to work identically on every
    // input type (keyboard focus and clicks aren't hover, and exist
    // regardless of whether the device has a mouse). Leaving
    // onMouseEnter/onMouseLeave OUT entirely on a non-hover device (rather
    // than, say, checking hoverCapable inside them) matters specifically
    // because mobile browsers synthesize a mouseenter/mouseover immediately
    // before a tap's click, to support hover-dependent UI exactly like this
    // one — if onMouseEnter were still wired up at all, that synthetic event
    // would flip isOpen to true DURING the tap, before handleClick's own `if
    // (!isOpen)` check ever runs, letting the very first tap both open and
    // navigate in one gesture (confirmed: this is what was actually
    // happening before hoverCapable existed). With onMouseEnter never
    // attached in the first place on such a device, nothing but
    // handleClick's own logic can ever set isOpen, so its check is reading
    // a value only IT controls.
    const hoverHandlers = {
        ...(hoverCapable && {
            onMouseEnter: () => onOpenChange?.(true),
            onMouseLeave: () => onOpenChange?.(false),
        }),
        onFocus: handleFocus,
        onBlur: () => onOpenChange?.(false),
        onClick: handleClick,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
    }

    // The whole slider (rect, orb, and label together) is the click target,
    // not just the label — rendering the root as a next/link Link instead of
    // a div when href is given. :hover and container-type: size both work
    // identically on an <a> as on a <div>, and position: fixed forces
    // block-level layout regardless of tag, so the existing slide-in-on-hover
    // CSS needs no changes for this.
    if (href) {
        return (
            <Link href={href} ref={sliderRef} className={sliderClassNames} style={sliderStyles} {...hoverHandlers}>
                {content}
            </Link>
        )
    }

    return (
        <div className={sliderClassNames} style={sliderStyles} {...hoverHandlers}>
            {content}
        </div>
    )
}

export function RedSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle, pathname}: SliderProps) {
    const colors = sliderColors.red
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    // heightParts[0] is the number
    const heightVal = parseFloat(heightParts[0])
    // heightParts[1] is the units
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const activeStrokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    const ownHref = "/projects"
    const isActive = pathname === ownHref

    const sliderRef = useRef<HTMLAnchorElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    // Closes the slider on navigation regardless of where the cursor
    // physically is (see the isOpen note in Slider() above) — resetting the
    // state directly, rather than remounting the whole component via
    // key={pathname}, since remounting all 4 sliders' keys simultaneously on
    // navigation was observed to make React duplicate DOM nodes instead of
    // replacing them (reproducible, not a one-off — see AllSliders below).
    useEffect(() => setIsOpen(false), [pathname])
    // Closes on a tap anywhere outside the slider — touch has no hover to
    // leave, so without this, opening a slider via the first-tap-to-open
    // behavior in Slider() would leave it open with no way to back out
    // short of tapping it again (which navigates). pointerdown (not click)
    // so it fires before a tap ON the slider's own navigate-click completes,
    // and only listens while open, to avoid a permanent global listener.
    useEffect(() => {
        if (!isOpen) return
        const handleOutside = (e: PointerEvent) => {
            if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('pointerdown', handleOutside)
        return () => document.removeEventListener('pointerdown', handleOutside)
    }, [isOpen])

    // The slider matching the current page always shows its stroke (an "you
    // are here" indicator) and becomes a Home button instead of a link to
    // the page you're already on — see the other 3 sliders for the same
    // pattern. On the home page itself none of the sliders is "active"
    // (none of them link to "/"), so every slider shows its stroke there
    // too. On a sub-page, an inactive slider's stroke only shows while
    // open/hovered — strokeSize itself stays constant either way (see
    // ClippedVector's strokeOpacity) so opening/closing never shifts layout,
    // just fades the stroke's visibility in and out.
    const strokeVisible = isActive || ALWAYS_STROKE_PATHS.includes(pathname) || isOpen
    const strokeSize = activeStrokeSize

    // The rect only wants a stroke on its top/bottom edges (not the sides), which
    // .sliderBorder (a plain border on the unclipped outer wrapper) handles
    // directly — no need for ClippedVector's general (all-sides) strokeWidth/
    // strokeColor mechanism here.
    const rect = RedSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderRed, strokeVisible ? styles.strokeVisible : '', className].filter(Boolean).join(" "),
    })
    const orb = RedOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline, strokeOpacity: strokeVisible ? 1 : 0})

    const icon = (
        <div className={styles.sliderIcon} style={{backgroundColor: colors.mask}}>
            <FontAwesomeIcon icon={isActive ? sliderIcons.home : sliderIcons.red} className={styles.sliderIconGlyph} style={{color: colors.outline}} />
        </div>
    )

    return Slider(width, height, rect, orb, "right", strokeSize, {labelText: isActive ? "Home" : "Projects", labelStyle: {fontFamily: "var(--font-new-amsterdam)", color: colors.mask, backgroundColor: colors.label}}, sliderClassName, sliderStyle, isActive ? "/" : ownHref, icon, isOpen, setIsOpen, sliderRef, "left")
}

export function YellowSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle, pathname}: SliderProps) {
    const colors = sliderColors.yellow
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const activeStrokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    const ownHref = "/about"
    const isActive = pathname === ownHref

    const sliderRef = useRef<HTMLAnchorElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => setIsOpen(false), [pathname])
    useEffect(() => {
        if (!isOpen) return
        const handleOutside = (e: PointerEvent) => {
            if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('pointerdown', handleOutside)
        return () => document.removeEventListener('pointerdown', handleOutside)
    }, [isOpen])

    const strokeVisible = isActive || ALWAYS_STROKE_PATHS.includes(pathname) || isOpen
    const strokeSize = activeStrokeSize

    const rect = YellowSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderYellow, strokeVisible ? styles.strokeVisible : '', className].filter(Boolean).join(" "),
    })
    const orb = YellowOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline, strokeOpacity: strokeVisible ? 1 : 0})
    const icon = (
        <div className={styles.sliderIcon} style={{backgroundColor: colors.mask}}>
            <FontAwesomeIcon icon={isActive ? sliderIcons.home : sliderIcons.yellow} className={styles.sliderIconGlyph} style={{color: colors.label}} />
        </div>
    )

    return Slider(width, height, rect, orb, "left", strokeSize, {labelText: isActive ? "Home" : "About Me", labelStyle: {fontFamily: "var(--font-idiqlat)", color: colors.mask, backgroundColor: colors.label}}, sliderClassName, sliderStyle, isActive ? "/" : ownHref, icon, isOpen, setIsOpen, sliderRef, "right")
}

export function GreenSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle, pathname}: SliderProps) {
    const colors = sliderColors.green
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const activeStrokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    const ownHref = "/experience"
    const isActive = pathname === ownHref

    const sliderRef = useRef<HTMLAnchorElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => setIsOpen(false), [pathname])
    useEffect(() => {
        if (!isOpen) return
        const handleOutside = (e: PointerEvent) => {
            if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('pointerdown', handleOutside)
        return () => document.removeEventListener('pointerdown', handleOutside)
    }, [isOpen])

    const strokeVisible = isActive || ALWAYS_STROKE_PATHS.includes(pathname) || isOpen
    const strokeSize = activeStrokeSize

    const rect = GreenSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderGreen, strokeVisible ? styles.strokeVisible : '', className].filter(Boolean).join(" "),
    })
    const orb = GreenOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline, strokeOpacity: strokeVisible ? 1 : 0})
    
    const icon = (
        <div className={styles.sliderIcon} style={{backgroundColor: colors.mask}}>
            <FontAwesomeIcon icon={isActive ? sliderIcons.home : sliderIcons.green} className={styles.sliderIconGlyph} style={{color: colors.outline}} />
        </div>
    )

    return Slider(width, height, rect, orb, "right", strokeSize, {labelText: isActive ? "Home" : "Experience", labelStyle: {fontFamily: "var(--font-idiqlat)", color: colors.mask, backgroundColor: colors.base}}, sliderClassName, sliderStyle, isActive ? "/" : ownHref, icon, isOpen, setIsOpen, sliderRef, "left")
}

export function BlueSlider({width, height, className, style, strokeWidth, sliderClassName, sliderStyle, pathname}: SliderProps) {
    const colors = sliderColors.blue
    const heightParts = height.split(/(?<=\d)(?!\d|\.)|(?<=\d\.\d)(?!\d)/)
    const heightVal = parseFloat(heightParts[0])
    const heightUnits = heightParts[1]
    const strokeSizeVal = heightVal*0.05
    const activeStrokeSize = (strokeWidth != undefined) ? strokeWidth : strokeSizeVal + heightUnits

    const ownHref = "/education"
    const isActive = pathname === ownHref

    const sliderRef = useRef<HTMLAnchorElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => setIsOpen(false), [pathname])
    useEffect(() => {
        if (!isOpen) return
        const handleOutside = (e: PointerEvent) => {
            if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('pointerdown', handleOutside)
        return () => document.removeEventListener('pointerdown', handleOutside)
    }, [isOpen])

    const strokeVisible = isActive || ALWAYS_STROKE_PATHS.includes(pathname) || isOpen
    const strokeSize = activeStrokeSize

    const rect = BlueSliderRect({
        width, height, style,
        className: [styles.sliderBorder, styles.borderBlue, strokeVisible ? styles.strokeVisible : '', className].filter(Boolean).join(" "),
    })
    const orb = BlueOrb({size: height, className, style, strokeWidth: strokeSize, strokeColor: colors.outline, strokeOpacity: strokeVisible ? 1 : 0})
    const icon = (
        <div className={styles.sliderIcon} style={{backgroundColor: colors.mask}}>
            <FontAwesomeIcon icon={isActive ? sliderIcons.home : sliderIcons.blue} className={styles.sliderIconGlyph} style={{color: colors.outline}} />
        </div>
    )

    return Slider(width, height, rect, orb, "left", strokeSize, {labelText: isActive ? "Home" : "Education", labelStyle: {fontFamily: "var(--font-new-amsterdam)", color: colors.mask, backgroundColor: colors.base}}, sliderClassName, sliderStyle, isActive ? "/" : ownHref, icon, isOpen, setIsOpen, sliderRef, "right")
}



type AllSlidersProps = {
    appState: AppStateTypes;
    className?: string;
    style?: CSSProperties;
};

// Width isn't a caller-facing concept for the slider group — each slider's rect
// still needs a real pixel width under the hood (ClippedVector's stroke math
// requires one, same reason strokeWidth does — see Slider() above), so it's
// derived from height by this fixed ratio instead of being passed in.
const SLIDER_WIDTH_RATIO = 2

// Slider height is defined once in CSS (--slider-height, set on .home in
// home_page.module.css) instead of being passed down as a prop, so an orb's
// scale-to-slider-height transform can read the same single source of truth.
// This still needs the real rendered pixel number, though — Slider()'s rect
// and orb both end up inside ClippedVector, which needs a literal pixel
// height (see mask_functions.tsx), not a CSS custom property string.
function useElementHeight<T extends HTMLElement>(initial: number) {
    const ref = useRef<T>(null)
    const [height, setHeight] = useState(initial)

    useEffect(() => {
        const measure = () => {
            if (ref.current) setHeight(ref.current.getBoundingClientRect().height)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [])

    return [ref, height] as const
}

export function AllSliders({ appState, className, style } : AllSlidersProps ) {
    const [allSlidersRef, heightPx] = useElementHeight<HTMLElement>(250)
    const height = `${heightPx}px`
    const width = `${heightPx * SLIDER_WIDTH_RATIO}px`
    
    const neverHovered = appState.neverHovered
    const setNeverHovered = appState.setNeverHovered
    const pathname = appState.pathname
    // The bounce is a "hey, interact with these" nudge for a first-time
    // visitor landing on the home page — it shouldn't play on other routes,
    // even though AllSliders itself (and neverHovered, which persists in
    // AppShell across navigation) is shared by every page.
    const shouldBounce = neverHovered && pathname === '/'

    return (
        // onFocus alongside onMouseOver — without it, a keyboard-only user
        // tabbing straight to the (first, bouncing) red slider would never
        // dismiss the bounce hint, and its still-running @keyframes
        // animation would keep overriding .sliderOpen's transform for as
        // long as it played, silently defeating the new focus-visible
        // open behavior on the one slider a first-time keyboard visitor is
        // most likely to reach first.
        <nav className={styles.allSliders} ref={allSlidersRef} aria-label="Site navigation" onMouseOver={() => setNeverHovered(false)} onFocus={() => setNeverHovered(false)}>
            <RedSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.topSlider} ${styles.slideLeft} ${shouldBounce ? styles.bounceSlider : ''}`} pathname={pathname}/>
            <GreenSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.bottomSlider} ${styles.slideLeft}`} pathname={pathname}/>
            <YellowSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.topSlider} ${styles.slideRight}`} pathname={pathname}/>
            <BlueSlider width={width} height={height} className={className} style={style} sliderClassName={`${styles.bottomSlider} ${styles.slideRight}`} pathname={pathname}/>
        </nav>
    )
}
