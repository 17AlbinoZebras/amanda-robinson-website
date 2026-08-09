'use client'
import React, { useEffect, useState } from 'react'

import styles from './styles/home_page.module.css'
import { clipToShape, TintedVector } from './mask_functions'
import { GreenOrb, RedOrb, YellowOrb, BlueOrb, RedSliderRect, RedSlider, YellowSlider, GreenSlider, BlueSlider, AllSliders } from './sliders'

function AboutSection() {
    
    return (
        <div className={styles.about}>
            <div className={styles.upperSection}>
                <div className={styles.blurb}>
                    <span>Hi! I&#39;m a full-stack web developer.<br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                </div>
                <div className={styles.headshotContainer}><img src="headshot.jpg" className={styles.headshot}/></div>
            </div>
            <div className={styles.lowerSection}>
                <div className={styles.techStacks}>
                    <span className={styles.sectionTitle}>Technology Stacks</span>
                    <br/>
                    <div className={styles.bodyText}>
                        <b>Languages: </b>
                        <p>Java, Python, TypeScript, HTML/CSS, SQL, C++, C</p>
                        <b>Frameworks/Libraries: </b>
                        <p>React, Bootstrap, Next.js, Node.js/Express, PySide6</p>
                        <b>Tools: </b>
                        <p>Git, VS Code, Claude Code, Warp, Linux</p>
                        <b>Other: </b>
                        <p>MySQL, PostgreSQL, SQL Server, AWS</p>
                    </div>
                </div>
                <div className={styles.hobbies}>
                    <span className={styles.sectionTitle}>Education</span>
                    <br/>
                    <div className={styles.bodyText}>
                        <b>Worcester Polytechnic Institute</b>
                        <p>Expected Graduation: May 2028</p>
                        <p>B.S. Computer Science</p>
                        <p>Minor in Economics</p>
                    </div>
                </div>
            </div>
            <AllSliders height="250px"/>
        </div>
    )
}

function Footer() {

}


// The width the px sizes below were originally tuned at. Used both as the
// SSR-safe default (before the client can measure the real window) and as the
// basis for converting each reference px size into an equivalent vw fraction.
const REFERENCE_VIEWPORT_WIDTH = 1600

export default function HomePage() {
    const [viewportWidth, setViewportWidth] = useState(REFERENCE_VIEWPORT_WIDTH)

    useEffect(() => {
        const updateWidth = () => setViewportWidth(window.innerWidth)
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    // How much of the "natural" 1:1 size change actually happens as the viewport
    // moves away from REFERENCE_VIEWPORT_WIDTH — 1 is full linear scaling, 0 is no
    // scaling at all. 0.8 is a gentle ~20% reduction in sensitivity (e.g. the red
    // orb at 1200px goes to 220px instead of a full-sensitivity 206px).
    const SCALE_DAMPING = 0.8

    // Scales referencePx (its rendered size at REFERENCE_VIEWPORT_WIDTH) with the
    // current viewport width, clamped to [min, max] so it doesn't get absurdly
    // small/large at extreme widths. This does the same job as CSS clamp(), but as
    // a real number rather than a browser-evaluated string — TintedVector's
    // maskSize/position percentages (used by all four orbs and the blob below) need
    // frameWidth/frameHeight to resolve to an actual pixel number to compute
    // correctly; a CSS clamp() string can't be parsed as one.
    const clampPx = (referencePx: number, min: number, max: number) => {
        const widthRatio = viewportWidth / REFERENCE_VIEWPORT_WIDTH
        const dampedRatio = 1 + SCALE_DAMPING * (widthRatio - 1)
        const scaled = referencePx * dampedRatio
        return Math.min(max, Math.max(min, scaled))
    }

    return (
        <div className={styles.home}>
            <div className={styles.orbs}>
                <div className={styles.redOrb}>
                    <RedOrb size={`${clampPx(275, 180, 380)}px`} className={styles.orbShadowRed} />
                </div>
                <div className={styles.yellowOrb}>
                    <YellowOrb size={`${clampPx(425, 280, 580)}px`} className={styles.orbShadowYellow} />
                </div>
                <div className={styles.greenOrb}>
                    <GreenOrb size={`${clampPx(350, 230, 480)}px`} className={styles.orbShadowGreen} />
                </div>
                <div className={styles.blueOrb}>
                    <BlueOrb size={`${clampPx(300, 195, 410)}px`} className={styles.orbShadowBlue} />
                </div>
            </div>
            {/* <div className={styles.sliders}>
                <AllSliders height='285px'/>
            </div> */}
            <div className={styles.mainText}>
                <div className={styles.nameSection}>
                    <div className={styles.blobMask}>
                        {/* Sized as a fixed ratio of --text-block-width (defined in
                            home_page.module.css on .nameSection, the same value
                            .nameStack's own width uses) instead of its own independent
                            clampPx call, so the blob always stays proportional to the
                            name text rather than scaling on a separate formula. 827.5/900
                            preserves the original blob-to-text-block size ratio. */}
                        <TintedVector
                            src="/masks/Blob.svg"
                            color="#FFB2B3"
                            width="calc(var(--text-block-width) * 827.5 / 900)"
                            style={{opacity: "80%"}}
                        />
                    </div>
                    <svg
                        className={styles.nameStack}
                        viewBox="0 0 900 300"
                        role="img"
                        aria-label="Amanda Robinson"
                    >
                        <text x="50%" y="128" textAnchor="middle" className={styles.svgNameText} fill="#5B5F97" stroke="#F5DFB4" strokeWidth="4">Amanda</text>
                        <text x="50%" y="272" textAnchor="middle" className={styles.svgNameText} fill="#5B5F97" stroke="#F5DFB4" strokeWidth="4">Robinson</text>
                    </svg>
                </div>
                <div className={styles.subtitleSection}>
                    <span className={styles.subtitle}>I sure do code.<br/>Lorem ipsum, Etc.</span>
                </div>
            </div>
            <AboutSection/>
        </div>
    )
}
