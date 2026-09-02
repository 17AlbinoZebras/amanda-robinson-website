'use client'

import React, { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'

import styles from './styles/about.module.css'
import { TintedVector } from './mask_functions'
import Link from 'next/link';

interface details {
    point: string,
    subPoints?: string[]
}

interface activity {
    org: string;
    role?: string;
    details?: details[];
}

interface hobby {
    title: string;
    photos?: {src: string, alt: string, caption?: JSX.Element}[]
}

const ayoPillars = (<ul>
        <li>Leadership</li>
        <li>Professionalism</li>
        <li>Growth and Future Growth</li>
        <li>Respect for Theatre and for the Theatre Community</li>
        <li>Work for the Betterment of Theatre</li>
    </ul>)

const activities: activity[] = [
    {org: 'Alpha Gamma Delta Sorority', role: 'Interim VP New Member Experience', details: [{point: 'Planned and executed bid day to welcome all our new members'}, {point: 'Organized and ran pledge-ins for new members'}]},
    {org: 'Masque Theatre', role: 'VP Props & Costumes', details: [{point: 'Managed and maintained the props and costumes closet all 3 years'}, {point: 'Created documentation for all positions in both departments'}]},
    {org: 'Women\'s Club Rugby', role: 'PR Officer', details: [{point: 'Took photos and made posts for our games'}, {point: 'Designed instagram posts to inspire prospective new members to join the team'}]},
    {org: 'Alpha Psi Omega Honor Society', role: 'Member', details: [{point: 'Embody the five pillars of Alpha Psi Omega: ', subPoints: ['Leadership', 'Professionalism', 'Growth and Future Growth', 'Respect for Theatre and for the Theatre Community', 'Work for the Betterment of Theatre']}]},
    {org: 'Student Alumni Society', role: 'Member', details: [{point: 'Plan and run campus wide events involving students, faculty, and alumni to uphold campus traditions'}]}
]

const hobbies: hobby[] = [
    {title: "Photography", photos: [
        {src: "/about/WakodahatcheeHeron.jpg", alt: "A tricolored heron wading in rippling water"},
        {src: "/about/KaylaSeniorPhoto.jpg", alt: "A woman in a white dress standing on a graffiti-covered pier at sunset"},
        {src: "/about/Squirrel.jpg", alt: "A squirrel standing on sandy ground"}
    ]},
    {title: "Theater", photos: [{src: "/about/8ML-Exec-Cropped.jpg", alt: "Group photo of the leadership team on the set of 8 Minutes Left", caption: <p className={styles.caption}>The leadership team of <i>8 Minutes Left</i>, which I assistant stage managed.</p>}]},
    {title: "Crafts", photos: [{src: "/about/origami-dragon.jpg", alt: "A purple origami dragon"}]},
    {title: "Board Games", photos: [{src: "/about/Catan.jpg", alt: "A Settlers of Catan board game set up mid-play, with resource tiles, roads, and cards"}]},
    {title: "Learning New Skills", photos: [{src: "/about/stained-glass-snail.jpg", alt: "A stained glass snail ornament in teal and orange", caption: <p className={styles.caption}>My first stained glass project!</p>}]}
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

    // Only the .canClick <li>s (ones with details/photos to reveal — see the
    // conditional class on each below) are genuinely interactive; the rest
    // stay plain, non-focusable text, matching how neither is clickable-
    // looking to a mouse user either. Enter/Space here mirror the Enter/
    // Space handling added for education.tsx's .course and projects.tsx's
    // .project — same reasoning: a plain <li onClick> has no keyboard
    // affordance of its own.
    const handleActivityKeyDown = (targetActivity: activity) => (e: React.KeyboardEvent) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            changeActiveActivity(targetActivity)
        }
    }

    const handleHobbyKeyDown = (targetHobby: hobby) => (e: React.KeyboardEvent) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            changeActiveHobby(targetHobby)
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

    // Without this, resizing the viewport while the box is open never
    // re-triggers the effect above (it's only keyed on displayedActivity/
    // displayedHobby, which don't change) — so the same text reflowing
    // taller at a narrower width left the box stuck at its old, now too-short
    // measured height, with content spilling past its edges.
    useEffect(() => {
        window.addEventListener('resize', remeasure)
        return () => window.removeEventListener('resize', remeasure)
    }, [])

    return (
        <div className={styles.page}>
            {/* maskSize was 'cover' with repeat='y' — 'cover' already fills
                the box with a single scaled-up instance, leaving no room for
                repeat='y' to ever actually kick in. Yellow-Memphis.svg
                (1494x750, ~2:1) needed a big scale-up to cover this box's
                usual (shorter, relatively wider) aspect ratio, reading as too
                zoomed in. An explicit, smaller "Wpx Hpx" tile (same aspect
                ratio) lets repeat (now both axes, not just 'y' — a single
                axis alone would leave the sides bare) actually tile it,
                still with zero gaps, just visibly smaller/calmer. */}
            <TintedVector src="/masks/Yellow-Memphis.svg" color='#FBDDA1' width='100vw' height='100vh' repeat maskSize="996px 500px" className={styles.aboutBackground}/>
            <header>
                <h1 className={styles.heading}>About Me</h1>
            </header>
            <div className={styles.mainContent}>
                <div className={styles.upperSection}>
                    <div className={styles.mainPhoto}>
                        {/* Was a plain <img> — the source file is a real
                            3247x4871 photo (4.6MB), and a plain <img> has no
                            way to request anything smaller: the full-size
                            original was what actually downloaded regardless
                            of this box's own ~200-350px rendered width, which
                            is the real reason this was slow to load. next/image
                            (already used the same way for the home page's own
                            headshot) generates and serves a properly
                            downscaled, modern-format (WebP/AVIF where
                            supported) version sized to what's actually
                            displayed, and lazy-loads it by default. width/
                            height here are the SOURCE file's real intrinsic
                            dimensions (used for aspect-ratio math, not the
                            display size) — sizes is what tells Next.js the
                            real display size to generate for.
                            87vw/25vw (not .mainPhoto's own literal
                            ~60vw-mobile/~17vw-desktop rendered width) —
                            .headshot's own transform: scale(1.45) below
                            enlarges the rendered image by 1.45x for its
                            crop/positioning, so the box's raw rendered size
                            understates how much actual resolution is needed;
                            sizing the request for the box alone (tried first)
                            visibly blurred once a properly-downscaled image
                            was what got upscaled 1.45x, instead of the old
                            plain <img>'s full-resolution original absorbing
                            it unnoticed. ~1.45x'd here (60→87, 17→25) keeps
                            the requested image sharp enough to survive that
                            same scale-up. */}
                        <Image
                            src="/about/AmandaHeadshot8ML.jpg"
                            alt="Amanda Robinson smiling in front of a brick wall"
                            width={3247}
                            height={4871}
                            sizes="(max-width: 700px) 87vw, 25vw"
                            className={styles.headshot}
                        />
                    </div>
                    <p className={styles.mainDescription}>
                        I&#39;m Amanda Robinson, a California native and a third year Computer Science student at WPI. I&#39;ve been using software to solve problems for as long as I can remember. What began as a love of coding and logic puzzles has grown into a passion for building thoughtful, creative products that tackle challenging real-world problems. For more about my skills and experience, visit my <Link href='/resume' className={styles.resumeLink}>resume</Link>!
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
                                    <li key={item.point}>{item.point}
                                    {item.subPoints && <ul className={styles.subPoints}>{item.subPoints.map((point) => (
                                        <li key={point}>{point}</li>
                                        ))}</ul>}
                                    </li>
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
                                        <img className={styles.previewImg} src={photo.src} alt={photo.alt} onLoad={remeasure}/>
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
                                <li
                                    key={activity.org}
                                    className={`${activity.details ? styles.canClick : ''} ${activeActivity === activity ? styles.activeSection : ''}`}
                                    onClick={() => changeActiveActivity(activity)}
                                    onKeyDown={activity.details ? handleActivityKeyDown(activity) : undefined}
                                    role={activity.details ? 'button' : undefined}
                                    tabIndex={activity.details ? 0 : undefined}
                                    aria-expanded={activity.details ? activeActivity === activity : undefined}
                                >{activity.org} | {activity.role}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.hobbies}>
                        <h2 className={styles.sectionTitle}>Hobbies & Interests</h2>
                        <ul>
                            {hobbies.map((hobby) => (
                                <li
                                    key={hobby.title}
                                    className={`${hobby.photos ? styles.canClick : ''} ${activeHobby === hobby ? styles.activeSection : ''}`}
                                    onClick={() => changeActiveHobby(hobby)}
                                    onKeyDown={hobby.photos ? handleHobbyKeyDown(hobby) : undefined}
                                    role={hobby.photos ? 'button' : undefined}
                                    tabIndex={hobby.photos ? 0 : undefined}
                                    aria-expanded={hobby.photos ? activeHobby === hobby : undefined}
                                >{hobby.title}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
