'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import styles from './styles/education.module.css'
import { TintedVector } from './mask_functions'

interface course {
    title: string;
    code: string;
    url: string;
    description: string;
}

const classes: course[] = [
        {title: "Algorithms", code: "CS2223", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-2223", description: "Building on a fundamental knowledge of data structures, data abstraction techniques, and mathematical tools, a number of examples of algorithm design and analysis worst case and average case will be developed. Topics include greedy algorithms, divide-and-conquer, dynamic programming, heuristics, and probabilistic algorithms. Problems will be drawn from areas such as sorting, graph theory, and string processing. The influence of the computational model on algorithm design will be discussed. Students will be expected to perform analysis on a variety of algorithms."},
        {title: "Software Engineering", code: "CS3733", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-3733", description: "This course introduces the fundamental principles of software engineering. Modern software development techniques and life cycles are emphasized. Topics include requirements analysis and specification, analysis and design, architecture, implementation, testing and quality, configuration management, and project management. Students will be expected to complete a project that employs techniques from the topics studied."},
        {title: "Database Systems", code: "CS3431", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-3431", description: "This course introduces the student to the design, use, and application of database management systems. Topics include the relational data model, relational query languages, design theory, and conceptual data design and modeling for relational database design. Techniques that provide for data independence and minimal redundancy will be discussed. Students will be expected to design and implement database system applications."},
        {title: "Data Science", code: "DS1010", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3846/data-science#DS-1010", description: "This course provides an introduction to the core concepts in Data Science and Artificial Intelligence. It covers a broad range of methodologies for working with and making informed decisions based on real-world data. Core topics include Python programming, data cleaning and preparation, statistics, data analytics, machine learning, natural language processing, data modeling, visualization, and business intelligence. In addition, the course emphasizes responsible and ethical considerations in the use of AI. Through hands-on activities and real-world data sets from diverse domains, students will practice using modern tools and techniques to explore data, gain insights, and understand how DS and AI systems are built and applied."},
        {title: "Operating Systems", code: "CS3013", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-3013", description: "This course provides the student with an understanding of the basic components of a general-purpose operating system. Topics include processes, process management, synchronization, input/output devices and their programming, interrupts, memory management, resource allocation, and an introduction to file systems. Students will be expected to design and implement a large piece of system software in the C programming language."},
        {title: "Cryptography", code: "CS4801", url: "https://users.wpi.edu/~kmus/ECE4802.htm", description: "This course provides an introduction to modern cryptography and communication security. It focuses on how cryptographic algorithms and protocols work and how to use them. The course covers the concepts of block ciphers and message authentication codes, public key encryption, digital signatures, and key establishment, as well as common examples and uses of such schemes, including the AES, RSA-OAEP, and the Digital Signature Algorithm. Basic cryptanalytic techniques and examples of practical security solutions are explored to understand how to design and evaluate modern security solutions."},
        {title: "Machine Learning", code: "CS4342", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-4342", description: "In this course, students will explore both theoretical and practical aspects of machine learning, including algorithms for regression, classification, dimensionality reduction, clustering, and density estimation. Specific topics may include neural networks and deep learning, Bayesian networks and probabilistic graphical models, principal component analysis, k-means clustering, decision trees and random forests, support vector machines, and kernel methods."}
    ]

export default function Education() {
    const [hoveredCourseCode, setHoveredCourseCode] = useState<string | null>(null);

    const [activeCourse, setActiveCourse] = useState<course | null>(null)

    const changeActiveCourse = (newCourse: course) => {
        if (newCourse.code != activeCourse?.code) {
            setActiveCourse(newCourse)
        }
        else {
            setActiveCourse(null)
        }
    }

    // The description box is always mounted now (see the JSX below) so its
    // height transition has something to animate from/to — a conditionally
    // rendered element has no "previous state" to interpolate, so it would
    // otherwise just pop in/out instantly regardless of any CSS transition.
    // But that means the text itself can't just be activeCourse?.description
    // directly: the moment a course closes, activeCourse goes straight to
    // null, and the text would vanish instantly while the box is still
    // visually shrinking around nothing. displayedCourse lags one step
    // behind on close (keeps showing the last real course while collapsing)
    // but updates immediately on open (new text appears as soon as the box
    // starts growing, not after).
    const [displayedCourse, setDisplayedCourse] = useState<course | null>(null)

    // When switching directly between two already-open courses, the new
    // description slides in over the old one instead of the box
    // collapsing/reopening or the text just snapping. incomingCourse holds
    // the course sliding in (rendered as a second, absolutely positioned
    // layer — see the JSX) while displayedCourse still holds the outgoing
    // one, which stays in normal flow (still driving the box's own height)
    // and slides out under it. slideSettled starts false (so the incoming
    // layer first paints off-screen) and flips true a frame later, which is
    // what actually triggers its CSS transition to slide into place.
    const [incomingCourse, setIncomingCourse] = useState<course | null>(null)
    const [slideSettled, setSlideSettled] = useState(false)
    // Vertical direction — the bottom row (below the description box) slides
    // up, the top row (above it) slides down, regardless of which course was
    // previously open, since the box sits between the two rows and this way
    // the motion always matches which side of it you clicked on.
    const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up')
    const courseRow = (c: course) => (classes.findIndex((x) => x.code === c.code) < 4 ? 0 : 1)
    // At the end of a slide, the outgoing element's slide-out class comes off
    // in the same instant its text updates to the new course — since it was
    // sitting off-screen, removing that class would normally itself
    // transition it back to center, now showing the new text, i.e. a second
    // unintended slide-in right after the real one. suppressReset disables
    // that one reset transition (transform snaps back instantly instead of
    // animating) and is cleared shortly after so the element's transition
    // works normally again next time.
    const [suppressReset, setSuppressReset] = useState(false)
    const prevActiveCourseRef = useRef<course | null>(null)
    // Whether a slide's 700ms window is currently running — lets a fast
    // follow-up click detect that it's interrupting one.
    const inFlightRef = useRef(false)
    const pendingTimersRef = useRef<{ endTimer: number; unsuppressTimer: number }>({ endTimer: 0, unsuppressTimer: 0 })

    // Instantly (no animation) settles the outgoing element on finalCourse,
    // reusing the same suppressReset/noTransition trick as a normal
    // end-of-slide reset. Called both at a slide's natural 700ms end AND to
    // flush an in-flight slide that's being interrupted by another course
    // click — without this, an interruption would just redirect the
    // still-animating outgoing element toward a new (possibly opposite)
    // target, visibly "rebounding" it through whatever position it was
    // already mid-flight at, instead of the clean cut this produces.
    const settleImmediately = (finalCourse: course) => {
        clearTimeout(pendingTimersRef.current.endTimer)
        clearTimeout(pendingTimersRef.current.unsuppressTimer)
        setSuppressReset(true)
        setDisplayedCourse(finalCourse)
        setIncomingCourse(null)
        setSlideSettled(false)
        inFlightRef.current = false
        pendingTimersRef.current.unsuppressTimer = window.setTimeout(() => setSuppressReset(false), 20)
    }

    useEffect(() => {
        const prevActiveCourse = prevActiveCourseRef.current
        prevActiveCourseRef.current = activeCourse

        if (!activeCourse) {
            if (inFlightRef.current && prevActiveCourse) {
                settleImmediately(prevActiveCourse)
            } else {
                setIncomingCourse(null)
                setSlideSettled(false)
            }
            return
        }

        if (prevActiveCourse && prevActiveCourse.code !== activeCourse.code) {
            if (inFlightRef.current) {
                settleImmediately(prevActiveCourse)
            }
            setSlideDirection(courseRow(activeCourse) === 1 ? 'up' : 'down')
            setIncomingCourse(activeCourse)
            setSlideSettled(false)
            inFlightRef.current = true
            const endTimer = window.setTimeout(() => settleImmediately(activeCourse), 700)
            pendingTimersRef.current.endTimer = endTimer
            return () => {
                clearTimeout(endTimer)
                clearTimeout(pendingTimersRef.current.unsuppressTimer)
            }
        }

        setDisplayedCourse(activeCourse)
    }, [activeCourse])

    // .courseDescription's open height is measured with JS and applied as an
    // explicit height (see the inline style below), rather than sized via
    // CSS Grid's usual 0fr/1fr content-based track trick. That trick relies
    // on .courseDescriptionInner (the grid item) auto-sizing to its content,
    // but .courseDescriptionInner also needs overflow:hidden of its own (to
    // clip the vertical slide, and to look clean when collapsed) — and a
    // grid item's automatic minimum size collapses to 0 whenever its
    // overflow isn't visible, which was capping the row at ~24px regardless
    // of actual content height. scrollHeight always reports the true content
    // height regardless of the current overflow/clip state, sidestepping
    // that entirely.
    const innerRef = useRef<HTMLDivElement>(null)
    const [measuredHeight, setMeasuredHeight] = useState(0)
    useLayoutEffect(() => {
        if (innerRef.current) {
            setMeasuredHeight(innerRef.current.scrollHeight)
        }
    }, [displayedCourse])

    // Triggers the incoming layer's slide-in, and — just as importantly —
    // re-measures the box's target height against the INCOMING course right
    // away, so the box starts resizing in parallel with the slide instead of
    // waiting for it to finish (the displayedCourse-keyed effect above only
    // fires once the swap completes, ~700ms later, which made the resize
    // read as a late, disconnected snap rather than part of one continuous
    // motion). Reading incomingRef's scrollHeight here does double duty: it
    // gives the new target height, and (just like reading offsetHeight
    // would) forces the synchronous layout flush needed to lock in the
    // incoming element's off-screen starting position as a real committed
    // state before slideSettled flips it — without that, the browser might
    // never actually commit that starting position before jumping to the
    // settled one, so the slide wouldn't visibly play at all.
    // How far the outgoing/incoming text layers translate — see slideDistance
    // below for why this has to be one shared, JS-computed pixel value
    // rather than each layer just using its own translateY(100%).
    const [slideDistance, setSlideDistance] = useState(0)
    const incomingRef = useRef<HTMLParagraphElement>(null)
    useLayoutEffect(() => {
        if (incomingCourse && incomingRef.current) {
            // incomingRef is the bare text element — .courseDescriptionInner's
            // own padding (measured by the displayedCourse-keyed effect
            // above, via innerRef) isn't part of its scrollHeight, so it has
            // to be added back here too. Otherwise this measurement and that
            // one disagree by exactly the padding amount, and the box would
            // do a small extra correction jump once the swap completes and
            // the other effect re-measures.
            const innerPadding = innerRef.current
                ? parseFloat(getComputedStyle(innerRef.current).paddingTop) + parseFloat(getComputedStyle(innerRef.current).paddingBottom)
                : 0
            const newHeight = incomingRef.current.scrollHeight + innerPadding
            // Each layer previously translated by its OWN translateY(100%) —
            // 100% of its own height. Outgoing and incoming are different
            // courses with different natural heights, so those were two
            // different absolute pixel distances covered over the same
            // 0.7s: whichever one is shorter finishes its move early,
            // leaving the two layers briefly overlapping (or gapped)
            // instead of staying edge-to-edge like a push-slide needs.
            // Using the larger of the two heights as a single shared
            // distance for both keeps them moving in lockstep — still fully
            // clears the shorter one off-screen, since it only needs to
            // travel a distance the taller one also travels.
            setSlideDistance(Math.max(measuredHeight, newHeight))
            setMeasuredHeight(newHeight)
            setSlideSettled(true)
        }
    }, [incomingCourse])

    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Blue-Squiggles.svg" color='#61659B' width='100vw' height='100vh' repeat="y" maskSize='cover' className={styles.educationBackground}/>
            <h1 className={styles.heading}>Education</h1>
            <div className={styles.upperSection}>
                <div className={styles.overview}>
                    <div className={styles.column}>
                        <b>Worcester Polytechnic Institute</b>
                        <p>Expected Graduation: May 2028</p>
                    </div>
                    <div className={styles.column}>
                        <p>B.S. Computer Science</p>
                        <p>Minor in Economics</p>
                    </div>
                </div>
            </div>
            <div className={styles.lowerSection}>
                <h2 className={styles.subHeading}>Relevant Courses</h2>
                <div className={styles.relevantCourses}>
                    <div className={styles.row}>
                        {classes.slice(0, 4).map((course) => (
                            <div key={course.code} className={styles.course} onMouseEnter={() => setHoveredCourseCode(course.code)} onMouseLeave={() => setHoveredCourseCode(null)} onClick={() => changeActiveCourse(course)}>
                                <div className={`${styles.courseTitle} ${activeCourse === course ? styles.activeCourse : ''}`}>{hoveredCourseCode === course.code ? course.code : course.title}</div>
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.courseDescription} ${activeCourse ? styles.courseDescriptionOpen : ''} ${incomingCourse ? styles.courseDescriptionSliding : ''}`} style={{height: activeCourse ? `${measuredHeight}px` : '0px'}}>
                        <div ref={innerRef} className={styles.courseDescriptionInner} style={{'--slide-distance': `${slideDistance}px`} as React.CSSProperties}>
                            <p className={`${styles.courseDescriptionText} ${incomingCourse ? (slideDirection === 'up' ? styles.slideOutUp : styles.slideOutDown) : ''} ${suppressReset ? styles.noTransition : ''}`}>{displayedCourse?.description}</p>
                            {incomingCourse && (
                                // Keyed by course code so an interruption (incomingCourse
                                // changing to a different course mid-slide) forces a clean
                                // remount instead of reusing this node — otherwise it would
                                // carry over its previous, still in-flight transform value
                                // and visibly continue animating from the wrong side.
                                <p key={incomingCourse.code} ref={incomingRef} className={`${styles.courseDescriptionText} ${styles.courseDescriptionIncoming} ${slideSettled ? styles.settled : (slideDirection === 'up' ? styles.enterFromBelow : styles.enterFromAbove)}`}>{incomingCourse.description}</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.row}>
                        {classes.slice(4).map((course) => (
                            <div key={course.code} className={styles.course} onMouseEnter={() => setHoveredCourseCode(course.code)} onMouseLeave={() => setHoveredCourseCode(null)} onClick={() => changeActiveCourse(course)}>
                                <div className={`${styles.courseTitle} ${activeCourse === course ? styles.activeCourse : ''}`}>{hoveredCourseCode === course.code ? course.code : course.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
