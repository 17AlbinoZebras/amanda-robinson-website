'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import styles from './styles/home_page.module.css'
import { clipToShape, TintedVector } from './mask_functions'
import { GreenOrb, RedOrb, YellowOrb, BlueOrb } from './sliders'

// Shrinks the ref'd element (as one unit, via a CSS custom property the
// caller applies through a transform: scale()) so it always fits within the
// viewport height instead of needing to scroll. scrollHeight is a layout
// metric — unaffected by the element's own transform — so this reads the
// content's true/natural height regardless of whatever scale is already
// applied, and never scales UP past 1, so content that already fits renders
// at its normal size. useLayoutEffect (not useEffect) so the correct scale is
// set before the first paint, rather than flashing at natural size for a
// frame first.
function useScaleToFit<T extends HTMLElement>(cssVar: string) {
    const ref = useRef<T>(null)

    useLayoutEffect(() => {
        const measure = () => {
            if (!ref.current) return
            const scale = Math.min(1, window.innerHeight / ref.current.scrollHeight)
            ref.current.style.setProperty(cssVar, `${scale}`)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [cssVar])

    return ref
}

function OverviewSection() {
    const contentRef = useScaleToFit<HTMLDivElement>('--overview-scale')

    return (
        <div className={styles.overview}>
            {/* Outside .overviewContent on purpose — this is a full-bleed 100vw/100vh
                backdrop, so it shouldn't shrink along with the scaled content. */}
            <TintedVector src="/masks/Green-Memphis.svg" color='#D4D5E9' width='100vw' height='100vh' maskSize="cover" className={styles.overviewBackground}/>
            <div className={styles.overviewContent} ref={contentRef}>
                <div className={styles.upperSection}>
                    <div className={styles.blurb}>
                        <span>Hi! I&#39;m Amanda. I build things that make people&#39;s<br/>lives easier. I am energized by untangling complex problems and turning creative ideas into technology people can actually use.</span>
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
                    <div className={styles.education}>
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
            </div>
        </div>
    )
}


// Each orb's size is now defined purely in CSS (see .redOrb etc. in
// home_page.module.css) — this reads back the real rendered pixel width of
// that box via a ref, since TintedVector still needs an actual number (not a
// CSS clamp() string) to size the mask so it fills the frame correctly. The
// resize listener keeps it in sync as the CSS clamp() value changes; `initial`
// is just the SSR-safe/first-paint guess (each orb's own clamp() preferred
// value) before the ref can be measured.
function useElementWidth<T extends HTMLElement>(initial: number) {
    const ref = useRef<T>(null)
    const [width, setWidth] = useState(initial)

    useEffect(() => {
        const measure = () => {
            if (ref.current) setWidth(ref.current.getBoundingClientRect().width)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [])

    return [ref, width] as const
}

export default function HomePage() {
    const [redOrbRef, redOrbWidth] = useElementWidth<HTMLDivElement>(275)
    const [yellowOrbRef, yellowOrbWidth] = useElementWidth<HTMLDivElement>(425)
    const [greenOrbRef, greenOrbWidth] = useElementWidth<HTMLDivElement>(350)
    const [blueOrbRef, blueOrbWidth] = useElementWidth<HTMLDivElement>(300)

    return (
        <div className={styles.home}>
            <TintedVector src="/masks/cow-blobs.svg" color='#F9F3EB' repeat maskSize="70%" className={styles.homeBackground}/>
            <div className={styles.orbs}>
                <div className={styles.redOrb} ref={redOrbRef}>
                    <RedOrb size={`${redOrbWidth}px`} className={styles.orbShadowRed} />
                </div>
                <div className={styles.yellowOrb} ref={yellowOrbRef}>
                    <YellowOrb size={`${yellowOrbWidth}px`} className={styles.orbShadowYellow} />
                </div>
                <div className={styles.greenOrb} ref={greenOrbRef}>
                    <GreenOrb size={`${greenOrbWidth}px`} className={styles.orbShadowGreen} />
                </div>
                <div className={styles.blueOrb} ref={blueOrbRef}>
                    <BlueOrb size={`${blueOrbWidth}px`} className={styles.orbShadowBlue} />
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
            <OverviewSection/>
        </div>
    )
}
