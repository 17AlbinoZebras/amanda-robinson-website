'use client'

import React, { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react'

import styles from './styles/about.module.css'
import { TintedVector } from './mask_functions'

interface hobby {
    title: string;
    photos: {src: string, caption?: JSX.Element}[]
}

const hobbies: hobby[] = [
    {title: "Photography", photos: [{src: "/about/WakodahatcheeHeron.jpg"}, {src: "/about/KaylaSeniorPhoto.jpg"}, {src: "/about/Squirrel.jpg"}]},
    {title: "Theater", photos: [{src: "/about/8ML-Exec-Cropped.jpg", caption: <span className={styles.caption}>The leadership team of <i>8 Minutes Left</i>, which I assistant stage managed.</span>}]},
    {title: "Crafts", photos: [{src: "/about/origami-dragon.jpg"}]},
    {title: "Board Games", photos: [{src: "/about/Catan.jpg"}]},
    {title: "Learning New Skills", photos: [{src: "/about/stained-glass-snail.jpg"}]}
]

export default function About() {
    const [activeHobby, setActiveHobby] = useState<hobby | null>(null)

    const changeActiveHobby = (newHobby: hobby) => {
        if (newHobby != activeHobby) {
            setActiveHobby(newHobby)
        }
        else {
            setActiveHobby(null)
        }
    }

    // displayedHobby lags activeHobby the same way education.tsx's
    // displayedCourse does: it's what's actually rendered, updating
    // immediately on a fresh open but staying put (so there's still content
    // to fade out) while closing or mid-switch. contentVisible drives
    // .previewInner's opacity — false while closed, and also held false
    // for one beat when switching directly between two already-open
    // hobbies, so the swap reads as a fade-out-then-fade-in rather than the
    // photos instantly changing underneath a still-visible box. Unlike
    // education's courseDescription, this is a single opacity fade, not a
    // slide — simpler for now since this might end up replaced later anyway.
    const [displayedHobby, setDisplayedHobby] = useState<hobby | null>(null)
    const [contentVisible, setContentVisible] = useState(false)
    const prevActiveHobbyRef = useRef<hobby | null>(null)
    const swapTimerRef = useRef(0)
    useEffect(() => {
        const prevActiveHobby = prevActiveHobbyRef.current
        prevActiveHobbyRef.current = activeHobby
        clearTimeout(swapTimerRef.current)

        if (!activeHobby) {
            setContentVisible(false)
            return
        }

        if (prevActiveHobby && prevActiveHobby.title !== activeHobby.title) {
            setContentVisible(false)
            swapTimerRef.current = window.setTimeout(() => {
                setDisplayedHobby(activeHobby)
                setContentVisible(true)
            }, 600)
            return
        }

        setDisplayedHobby(activeHobby)
        setContentVisible(true)
    }, [activeHobby])

    // .preview's open height is measured with JS and applied as an explicit,
    // transitioning height (see the inline style below) — same technique as
    // education's courseDescription, for the same reason: height:auto can't
    // be transitioned, and hobbies have very different natural heights (0
    // photos vs 3).
    const previewInnerRef = useRef<HTMLDivElement>(null)
    const [measuredHeight, setMeasuredHeight] = useState(0)
    const remeasure = () => {
        if (previewInnerRef.current) {
            setMeasuredHeight(previewInnerRef.current.scrollHeight)
        }
    }
    useLayoutEffect(remeasure, [displayedHobby])

    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Yellow-Memphis.svg" color='#FBDDA1' width='100vw' height='100vh' repeat='y' maskSize='cover' className={styles.aboutBackground}/>
            <span className={styles.heading}>About Me</span>
            <div className={styles.mainContent}>
                <div className={styles.upperSection}>
                    <div className={styles.mainPhoto}>
                        <img src="about/AmandaHeadshot8ML.jpg" className={styles.headshot}></img>
                    </div>
                    <div className={styles.mainDescription}>
                        I&#39;m Amanda Robinson, a California native and a third year Computer Science student at WPI. I&#39;ve been using software to solve problems for as long as I can remember. What began as a love of coding and logic puzzles has grown into a passion for building thoughtful, creative products that tackle challenging real-world problems.
                    </div>
                </div>
                <div className={styles.preview} style={{height: activeHobby ? `${measuredHeight}px` : '0px'}}>
                    <div ref={previewInnerRef} className={`${styles.previewInner} ${contentVisible ? styles.previewVisible : ''}`}>
                        {displayedHobby?.photos.map((photo) => (
                            <div key={photo.src} className={styles.previewSegment}>
                                {/* Images load asynchronously — the scrollHeight
                                    measurement above can easily run before they've
                                    arrived (so .previewImg's height:100%, which
                                    needs a definite ancestor height to resolve
                                    against, isn't contributing anything yet),
                                    leaving the box stuck too short. onLoad
                                    re-measures once each image's real size is
                                    known. */}
                                <img className={styles.previewImg} src={photo.src} onLoad={remeasure}/>
                                { photo.caption }
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.lowerSection}>
                    <div className={styles.activities}>
                        <span className={styles.sectionTitle}>Activities & Leadership</span>
                        <ul>
                            <li>Alpha Gamma Delta Sorority | Interim VP New Member Experience</li>
                            <li>Masque Theatre | VP Props & Costumes</li>
                            <li>Women&#39;s Club Rugby | PR Officer</li>
                            <li>Alpha Psi Omega Honor Society | Member</li>
                            <li>Student Alumni Society | Member</li>
                        </ul>
                    </div>
                    <div className={styles.hobbies}>
                        <span className={styles.sectionTitle}>Hobbies & Interests</span>
                        <ul>
                            {hobbies.map((hobby) => (
                                <li key={hobby.title} onClick={() => changeActiveHobby(hobby)}>{hobby.title}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
