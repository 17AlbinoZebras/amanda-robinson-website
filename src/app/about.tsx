'use client'

import React, { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react'

import styles from './styles/about.module.css'
import { TintedVector } from './mask_functions'

interface activity {
    org: string;
    role?: string;
    details?: string[];
}

interface hobby {
    title: string;
    photos?: {src: string, caption?: JSX.Element}[]
}

const activities: activity[] = [
    {org: 'Alpha Gamma Delta Sorority', role: 'Interim VP New Member Experience', details: ['Planned and executed bid day to welcome all our new members', 'Organized and ran pledge-ins for new members']},
    {org: 'Masque Theatre', role: 'VP Props & Costumes', details: ['Managed and maintained the props and costumes closet all 3 years', 'Created documentation for all positions in both departments']},
    {org: 'Women\'s Club Rugby', role: 'PR Officer', details: ['Took photos and made posts for our games', 'Designed instagram posts to inspire prospective new members to join the team']},
    {org: 'Alpha Psi Omega Honor Society', role: 'Member'},
    {org: 'Student Alumni Society', role: 'Member'}
]

const hobbies: hobby[] = [
    {title: "Photography", photos: [{src: "/about/WakodahatcheeHeron.jpg"}, {src: "/about/KaylaSeniorPhoto.jpg"}, {src: "/about/Squirrel.jpg"}]},
    {title: "Theater", photos: [{src: "/about/8ML-Exec-Cropped.jpg", caption: <p className={styles.caption}>The leadership team of <i>8 Minutes Left</i>, which I assistant stage managed.</p>}]},
    {title: "Crafts", photos: [{src: "/about/origami-dragon.jpg"}]},
    {title: "Board Games", photos: [{src: "/about/Catan.jpg"}]},
    {title: "Learning New Skills", photos: [{src: "/about/stained-glass-snail.jpg", caption: <p className={styles.caption}>My first stained glass project!</p>}]}
]

export default function About() {
    const [activeActivity, setActiveActivity] = useState<activity | null>(null)
    const [activeHobby, setActiveHobby] = useState<hobby | null>(null)

    const changeActiveActivity = (newActivity: activity) => {
        if ((newActivity != activeActivity) && (newActivity.details)) {
            setActiveHobby(null)
            setActiveActivity(newActivity)
        }
        else {
            setActiveActivity(null)
        }
    }

    const changeActiveHobby = (newHobby: hobby) => {
        if ((newHobby != activeHobby)&& (newHobby.photos)) {
            setActiveActivity(null)
            setActiveHobby(newHobby)
        }
        else {
            setActiveHobby(null)
        }
    }

    // displayedActivity/displayedHobby lag activeActivity/activeHobby the
    // same way education.tsx's displayedCourse does: they're what's actually
    // rendered, updating immediately on a fresh open but staying put (so
    // there's still content to fade out) while closing or mid-switch.
    // activeActivity and activeHobby share this one lag/fade mechanism (and
    // the one .preview box) since only one of the two is ever active at a
    // time — activeKey is whichever one that is (or null), so switching
    // categories (a hobby to an activity, or vice versa) is treated as just
    // another swap, the same as switching within one category. Setting both
    // displayed* together on every settle is what clears out the one that
    // ISN'T active — e.g. picking an activity while a hobby's showing
    // naturally nulls out displayedHobby at the same moment displayedActivity
    // is set, without needing separate clearing logic. contentVisible drives
    // .previewInner's opacity — false while closed, and also held false for
    // one beat mid-swap, so it reads as a fade-out-then-fade-in rather than
    // content instantly changing underneath a still-visible box. Unlike
    // education's courseDescription, this is a single opacity fade, not a
    // slide — simpler for now since this might end up replaced later anyway.
    const [displayedActivity, setDisplayedActivity] = useState<activity | null>(null)
    const [displayedHobby, setDisplayedHobby] = useState<hobby | null>(null)
    const [contentVisible, setContentVisible] = useState(false)
    const prevActiveKeyRef = useRef<string | null>(null)
    const swapTimerRef = useRef(0)
    useEffect(() => {
        const activeKey = activeActivity ? `activity:${activeActivity.org}` : activeHobby ? `hobby:${activeHobby.title}` : null
        const prevActiveKey = prevActiveKeyRef.current
        prevActiveKeyRef.current = activeKey
        clearTimeout(swapTimerRef.current)

        if (!activeKey) {
            setContentVisible(false)
            return
        }

        if (prevActiveKey && prevActiveKey !== activeKey) {
            setContentVisible(false)
            swapTimerRef.current = window.setTimeout(() => {
                setDisplayedActivity(activeActivity)
                setDisplayedHobby(activeHobby)
                setContentVisible(true)
            }, 600)
            return
        }

        setDisplayedActivity(activeActivity)
        setDisplayedHobby(activeHobby)
        setContentVisible(true)
    }, [activeActivity, activeHobby])

    // .preview's open height is measured with JS and applied as an explicit,
    // transitioning height (see the inline style below) — same technique as
    // education's courseDescription, for the same reason: height:auto can't
    // be transitioned, and activities/hobbies have very different natural
    // heights (an activity with no details, a hobby with 0 photos, one
    // with 3, ...).
    const previewInnerRef = useRef<HTMLDivElement>(null)
    const [measuredHeight, setMeasuredHeight] = useState(0)
    const remeasure = () => {
        if (previewInnerRef.current) {
            setMeasuredHeight(previewInnerRef.current.scrollHeight)
        }
    }
    useLayoutEffect(remeasure, [displayedActivity, displayedHobby])

    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Yellow-Memphis.svg" color='#FBDDA1' width='100vw' height='100vh' repeat='y' maskSize='cover' className={styles.aboutBackground}/>
            <h1 className={styles.heading}>About Me</h1>
            <div className={styles.mainContent}>
                <div className={styles.upperSection}>
                    <div className={styles.mainPhoto}>
                        <img src="about/AmandaHeadshot8ML.jpg" className={styles.headshot}></img>
                    </div>
                    <p className={styles.mainDescription}>
                        I&#39;m Amanda Robinson, a California native and a third year Computer Science student at WPI. I&#39;ve been using software to solve problems for as long as I can remember. What began as a love of coding and logic puzzles has grown into a passion for building thoughtful, creative products that tackle challenging real-world problems.
                    </p>
                </div>
                <div className={`${styles.preview} ${(activeActivity || activeHobby) ? styles.previewOpen : ''}`} style={{height: (activeActivity || activeHobby) ? `${measuredHeight}px` : '0px'}}>
                    <div ref={previewInnerRef} className={`${styles.previewInner} ${contentVisible ? styles.previewVisible : ''}`}>
                        {/* Only one of these two is ever mounted at a time
                            (displayedActivity/displayedHobby are mutually
                            exclusive — see the effect above) — rendering
                            both unconditionally would leave an always-present,
                            empty sibling competing for width even when it has
                            nothing to show. */}
                        {displayedActivity && (
                            <ul className={styles.activityPreview}>
                                {displayedActivity.details?.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )}
                        {displayedHobby && (
                            <div className={styles.hobbyPreview}>
                                {displayedHobby.photos?.map((photo) => (
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
                        )}
                    </div>
                </div>
                <div className={styles.lowerSection}>
                    <div className={styles.activities}>
                        <h2 className={styles.sectionTitle}>Activities & Leadership</h2>
                        <ul>
                            {activities.map((activity) => (
                                <li key={activity.org} className={`${activity.details ? styles.canClick : ''} ${activeActivity === activity ? styles.activeSection : ''}`} onClick={() => changeActiveActivity(activity)}>{activity.org} | {activity.role}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.hobbies}>
                        <h2 className={styles.sectionTitle}>Hobbies & Interests</h2>
                        <ul>
                            {hobbies.map((hobby) => (
                                <li key={hobby.title} className={`${hobby.photos ? styles.canClick : ''} ${activeHobby === hobby ? styles.activeSection : ''}`} onClick={() => changeActiveHobby(hobby)}>{hobby.title}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
