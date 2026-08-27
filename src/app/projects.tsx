'use client'
import React, { useEffect, useRef, useState } from 'react'

import styles from './styles/projects.module.css'
import { TintedVector } from './mask_functions'

// TODO: fill in each project's real GitHub repo URL — titles link here
// (only while their panel is open, see guardTitleLink below) once these
// are set.
const projectGithubUrls: Record<string, string> = {
    intervle: 'https://github.com/17AlbinoZebras/Intervle-wordle-game',
    shopcomp: 'https://github.com/17AlbinoZebras/ShopComp',
    heatmap: 'https://github.com/17AlbinoZebras/outreach-heatmap',
}

// Matches the site's one existing responsive breakpoint (the plain CSS
// media queries throughout styles/*.module.css) — kept as a JS constant
// here because Heatmap's mobile fallback (see below) needs to make an
// actual mount/unmount decision, not just a visual one, so it can't be CSS
// alone. If that breakpoint ever changes, this needs updating to match.
const MOBILE_BREAKPOINT_PX = 700

function useIsMobile() {
    // false first (assumes desktop) since there's no viewport to measure
    // during SSR — corrected on mount, same tradeoff sliders.tsx's
    // useElementHeight and home_page.tsx's useElementWidth already make for
    // their own measure-after-mount values.
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)
        setIsMobile(mql.matches)
        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mql.addEventListener('change', handleChange)
        return () => mql.removeEventListener('change', handleChange)
    }, [])
    return isMobile
}

export default function Projects() {
    const isMobile = useIsMobile()
    const [activeProject, setActiveProject] = useState<string>('heatmap')

    const changeActiveProject= (proj: string) => {
        if (activeProject != proj) {
            setActiveProject(proj)
        }
    }

    // .project itself is a plain <div> — clickable via its own onClick below,
    // but with no keyboard affordance at all by default (divs aren't
    // focusable, and have no native Enter/Space activation). role="button" +
    // tabIndex make it a real Tab stop; this handles the two keys a native
    // <button> would respond to. e.target === e.currentTarget scopes it to
    // the div itself, not a bubbled keydown from one of its own focusable
    // children (the title <a>, the expand toggle <button>) — those already
    // handle their own Enter/Space natively, and without this guard a single
    // Enter press on the title would double-fire changeActiveProject (once
    // from this handler via bubbling, once from the click the browser
    // synthesizes for the link) — harmless since it no-ops when already
    // active, but redundant.
    const handleProjectKeyDown = (proj: string) => (e: React.KeyboardEvent) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            changeActiveProject(proj)
        }
    }

    // A title only ever links out once its own panel is the open one, and
    // only once projectGithubUrls actually has a real URL for it (still
    // blank above, to be filled in later) — until then this is false and
    // the title renders as plain inert text, same as before it had a link
    // at all.
    const titleLinksTo = (proj: string) => activeProject === proj ? projectGithubUrls[proj] : ''

    // Only one project is ever open at a time, so a single shared boolean is
    // enough — no need to track this per project. Resets whenever the open
    // project changes so a newly opened project always starts in the normal
    // (not expanded) view rather than inheriting whatever the previous
    // project was left in.
    const [previewExpanded, setPreviewExpanded] = useState(false)
    useEffect(() => setPreviewExpanded(false), [activeProject])

    const toggleExpandPreview = (e: React.MouseEvent) => {
        // Stops the click from also bubbling up to .project's own onClick —
        // harmless today since changeActiveProject no-ops when the clicked
        // project is already active, but stopping it here makes that
        // explicit instead of relying on that guard incidentally covering it.b
        e.stopPropagation()
        setPreviewExpanded((expanded) => {
            const newlyExpanded = !expanded
            // Expanding counts as "interacted with" the same as a real click
            // into the iframe does — only gated to the two iframe projects
            // (not ShopComp) since that's the only thing the badge is ever
            // shown on. dismissInteractiveHint is declared further down this
            // component, but that's fine: this closure only runs later, on
            // click, by which point the render that defines it has already
            // completed.
            if (newlyExpanded && (activeProject === 'intervle' || activeProject === 'heatmap')) {
                dismissInteractiveHint()
            }
            return newlyExpanded
        })
    }

    // Guards a title <a>'s own navigation on a click that's opening the
    // panel (not one on an already-open panel). Without this, clicking a
    // closed title both opens the panel AND navigates away: the click
    // bubbles to .project's onClick, which calls setActiveProject
    // synchronously (React flushes discrete events like click immediately),
    // so by the time the browser gets to the click's own default action
    // (follow the link), href has ALREADY been set to the real URL by that
    // same re-render — even though the element had no href at the moment
    // it was actually clicked. Preventing default here (but not stopping
    // propagation, so .project's onClick still runs and opens the panel)
    // means a click only ever opens; a SEPARATE, later click on the
    // now-open title is what actually navigates.
    const guardTitleLink = (proj: string) => (e: React.MouseEvent) => {
        if (activeProject !== proj) {
            e.preventDefault()
        }
    }

    // The iframe previews (Intervle, Heatmap) embed the actual live site —
    // easy to mistake for a static screenshot at a glance, since nothing
    // about an <iframe> visually signals "this is a real, running app you
    // can click into." (ShopComp's <video> doesn't need this: native
    // controls already make it obviously interactive.) One shared,
    // in-memory flag (not persisted) for all three previews, mirroring
    // AppShell's neverHovered for the sliders.
    //
    // Dismisses only on a real click/interaction, not a hover — this is
    // front-and-center on the page (unlike the sliders, off to the sides),
    // so an accidental mouseover while just reading the badge used to make
    // it vanish before it was actually read.
    const [showInteractiveHint, setShowInteractiveHint] = useState(true)
    const dismissInteractiveHint = () => setShowInteractiveHint(false)

    // A click that lands inside a cross-origin iframe never bubbles out to
    // this page's event listeners at all — it's entirely the iframe's own
    // document handling it, so a plain onClick on the wrapper can't see it.
    // Focus moving into the iframe is observable indirectly, though:
    // document.activeElement becomes the <iframe> element itself for as
    // long as focus is anywhere inside it — the standard workaround for
    // detecting an iframe click from outside.
    //
    // This used to watch for the window's own 'blur' event (fired when
    // focus first moves from the outer page into ANY child frame) rather
    // than polling, but that turned out to be unreliable in a way that's
    // specific to this page: per spec, window blur/focus track whether the
    // TOP-LEVEL document has focus at all, not which element currently
    // holds it — so it only fires once, on the very first handoff into
    // either iframe, and never again for later focus changes happening
    // purely inside an iframe that's already got it (e.g. clicking between
    // several of Heatmap's own toggles/checkboxes). Intervle happened to
    // keep working because its game repeatedly blurs/refocuses its own
    // input during play, regenerating fresh transitions — Heatmap's
    // controls don't, so once that one lifetime transition got used up
    // (confirmed separately: Intervle quietly focuses itself within a few
    // seconds of load, unrelated to any click), no further Heatmap
    // interaction could ever produce a new blur event to react to.
    // Polling activeElement directly instead has no such one-shot problem —
    // it doesn't matter when focus arrived, only whether it's there now.
    //
    // Still gated on the cursor actually hovering the preview at the
    // moment, though: without that, whichever iframe happens to already
    // hold focus would dismiss the hint the instant it's later reopened,
    // even just to glance at it — confirmed Heatmap's own page does NOT
    // grab focus on load on its own (activeElement is plain <body> until a
    // real click happens there), so this gate is specifically to guard
    // against Intervle's self-focus quirk, not a general risk.
    const intervleIframeRef = useRef<HTMLIFrameElement>(null)
    const heatmapIframeRef = useRef<HTMLIFrameElement>(null)
    const isHoveringPreview = useRef(false)
    useEffect(() => { isHoveringPreview.current = false }, [activeProject])
    const handlePreviewMouseEnter = () => { isHoveringPreview.current = true }
    const handlePreviewMouseLeave = () => { isHoveringPreview.current = false }
    useEffect(() => {
        if (!showInteractiveHint) return
        const activeIframeRef = activeProject === 'intervle' ? intervleIframeRef : activeProject === 'heatmap' ? heatmapIframeRef : null
        if (!activeIframeRef) return
        const pollId = setInterval(() => {
            if (isHoveringPreview.current && document.activeElement === activeIframeRef.current) {
                dismissInteractiveHint()
            }
        }, 200)
        return () => clearInterval(pollId)
    }, [showInteractiveHint, activeProject])

    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Red-Squiggles.svg" color='#FDBCBB' width='100vw' height='100vh' maskSize='cover' className={styles.projectsBackground}/>
            <header>
                <h1 className={styles.heading}>Projects</h1>
            </header>
            <div className={styles.projects}>
                <div
                    onClick={() => changeActiveProject('intervle')}
                    onKeyDown={handleProjectKeyDown('intervle')}
                    role="button"
                    tabIndex={0}
                    aria-expanded={activeProject === 'intervle'}
                    aria-label="Intervle"
                    className={`${styles.project} ${activeProject === 'intervle' ? styles.projectOpen : styles.projectClosed} ${styles.intervle}`}
                >
                    {/* role="heading"/aria-level (not a wrapping <h2>) — the
                        rotate(-90deg) closed-state transform (see
                        .projectClosed .projectTitle below) needs to apply
                        directly to whichever element flexbox measures for
                        layout, which has to stay this <a> itself: wrapping
                        it in a separate <h2> moved that measured box to the
                        (unrotated) wrapper while the transform stayed on the
                        inner <a>, so the two disagreed on the tab's size and
                        the closed tabs overlapped. */}
                    <a
                        role="heading"
                        aria-level={2}
                        href={titleLinksTo('intervle') || undefined}
                        target={activeProject === 'intervle' ? '_blank' : undefined}
                        rel={activeProject === 'intervle' ? 'noopener noreferrer' : undefined}
                        onClick={guardTitleLink('intervle')}
                        className={`${styles.projectTitle} ${activeProject === 'intervle' ? styles.openTitle : ''}`}
                    >
                        Intervle
                    </a>
                    <div className={`${styles.projectContent} ${previewExpanded ? styles.previewExpanded : ''}`}>
                        <div className={styles.preview}>
                            <div className={styles.previewMedia} onMouseEnter={handlePreviewMouseEnter} onMouseLeave={handlePreviewMouseLeave}>
                                {/* Only mounted while this is the open panel —
                                    an <iframe> loads a whole separate page/app,
                                    not just an image, so the other two sitting
                                    around unmounted-but-loaded was real wasted
                                    load time on every visit regardless of
                                    whether they were ever opened. */}
                                {activeProject === 'intervle' && (
                                    <iframe ref={intervleIframeRef} src="https://intervle-wordle-game.vercel.app/" title="Intervle: A Wordle Spin-off" className={styles.webPreview} width="600" height="370"/>
                                )}
                                <span className={`${styles.interactiveHint} ${showInteractiveHint ? '' : styles.interactiveHintHidden}`}>Try it live!</span>
                            </div>
                            <button type="button" className={styles.expandToggle} onClick={toggleExpandPreview} aria-label={previewExpanded ? 'Show description' : 'Expand preview'}/>
                        </div>
                        <div className={styles.description}><p>My first real web design project back in 2023, <a href='https://intervle-wordle-game.vercel.app/' target="_blank" rel="noopener noreferrer">Intervle</a> is a responsive web game inspired by everybody&#39;s favorite word puzzle, Wordle, but with a lexicographic twist. Results indicate alphabetical distance from the target word in either direction for each letter position.<br/>Technologies: HTML, CSS, JavaScript (Bootstrap)</p></div>
                    </div>
                </div>
                <div
                    onClick={() => changeActiveProject('shopcomp')}
                    onKeyDown={handleProjectKeyDown('shopcomp')}
                    role="button"
                    tabIndex={0}
                    aria-expanded={activeProject === 'shopcomp'}
                    aria-label="ShopComp"
                    className={`${styles.project} ${activeProject === 'shopcomp' ? styles.projectOpen : styles.projectClosed} ${styles.shopcomp}`}
                >
                    <a
                        role="heading"
                        aria-level={2}
                        href={titleLinksTo('shopcomp') || undefined}
                        target={activeProject === 'shopcomp' ? '_blank' : undefined}
                        rel={activeProject === 'shopcomp' ? 'noopener noreferrer' : undefined}
                        onClick={guardTitleLink('shopcomp')}
                        className={`${styles.projectTitle} ${activeProject === 'shopcomp' ? styles.openTitle : ''}`}
                    >
                        ShopComp
                    </a>
                    <div className={`${styles.projectContent} ${previewExpanded ? styles.previewExpanded : ''}`}>
                        <div className={styles.preview}>
                            {/* No interactiveHint here — native <video controls>
                                already makes this one obviously interactive,
                                unlike the two iframes. Not a dismiss trigger
                                either: the hint is only ever about "is this
                                iframe a live app," so only actually clicking
                                into one of the two iframes should clear it —
                                interacting with this video shouldn't. */}
                            <div className={styles.previewMedia}>
                                {/* preload="none" — a plain <video> otherwise
                                    starts fetching (at least metadata, often
                                    more) as soon as it mounts, same as the
                                    iframes' unwanted eager-load problem below,
                                    just lighter-weight. poster shows a real
                                    frame in its place until the user actually
                                    presses play. */}
                                <video className={styles.webPreview} width='650' height='370' src='projects/shopcomp-functionality.mp4' poster="/projects/shopcomp-poster.jpg" preload="none" controls controlsList="nodownload" muted/>
                            </div>
                            <button type="button" className={styles.expandToggle} onClick={toggleExpandPreview} aria-label={previewExpanded ? 'Show description' : 'Expand preview'}/>
                        </div>
                        <div className={styles.description}><p>Shopcomp is a full-stack grocery comparison web app with an AWS backend, enabling users to upload/manage receipts, maintain shopping lists, and compute best-price options from historical purchase data using a MySQL relational schema. In my team, I was responsible for the shopping list and calculation functionality shown above for our Software Engineering final project. Additionally, I designed and refactored database schema and developed complex queries.<br/>Technologies: Next.js, React, TypeScript, AWS Amplify/Cognito, AWS CDK, MySQL</p></div>
                    </div>
                </div>
                <div
                    onClick={() => changeActiveProject('heatmap')}
                    onKeyDown={handleProjectKeyDown('heatmap')}
                    role="button"
                    tabIndex={0}
                    aria-expanded={activeProject === 'heatmap'}
                    aria-label="Clinical Analysis"
                    className={`${styles.project} ${activeProject === 'heatmap' ? styles.projectOpen : styles.projectClosed} ${styles.heatmap}`}
                >
                    <a
                        role="heading"
                        aria-level={2}
                        href={titleLinksTo('heatmap') || undefined}
                        target={activeProject === 'heatmap' ? '_blank' : undefined}
                        rel={activeProject === 'heatmap' ? 'noopener noreferrer' : undefined}
                        onClick={guardTitleLink('heatmap')}
                        className={`${styles.projectTitle} ${activeProject === 'heatmap' ? styles.openTitle : ''}`}
                    >
                        Clinical Analysis
                    </a>
                    <div className={`${styles.projectContent} ${previewExpanded ? styles.previewExpanded : ''}`}>
                        <div className={styles.preview}>
                            <div className={styles.previewMedia} onMouseEnter={handlePreviewMouseEnter} onMouseLeave={handlePreviewMouseLeave}>
                                {/* Heatmap's live app is a dense data
                                    dashboard — small controls, hover-driven
                                    detail, a map meant for a mouse — that
                                    isn't usable through a shrunk-down iframe
                                    on a phone. Below the mobile breakpoint it
                                    swaps for a plain screenshot and a real
                                    link out, instead of embedding something
                                    that doesn't work there anyway. Otherwise,
                                    same conditional-mount reasoning as
                                    Intervle's iframe above. */}
                                {isMobile ? (
                                    <>
                                        <img src="/projects/heatmap.jpg" alt="Screenshot of the Hospital Outreach Heatmap showing patient density across Florida counties" className={styles.mobilePreviewImage}/>
                                        <a href="https://patient-heatmap-public.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.openLiveDemoButton}>Open the live demo</a>
                                    </>
                                ) : (
                                    <>
                                        {activeProject === 'heatmap' && (
                                            <iframe ref={heatmapIframeRef} src="https://patient-heatmap-public.vercel.app/" title="Hospital Outreach Heatmap" className={styles.webPreview} width="600" height="370"/>
                                        )}
                                        <span className={`${styles.interactiveHint} ${showInteractiveHint ? '' : styles.interactiveHintHidden}`}>Try it live!</span>
                                    </>
                                )}
                            </div>
                            <button type="button" className={styles.expandToggle} onClick={toggleExpandPreview} aria-label={previewExpanded ? 'Show description' : 'Expand preview'}/>
                        </div>
                        <div className={styles.description}><p>A <a href='https://patient-heatmap-public.vercel.app/' target="_blank" rel="noopener noreferrer">dynamic heatmap</a> representation of hospital outreach statistics based on a variety of data. This application was used by the South Florida Proton Therapy Institute to identify areas to prioritize outreach. This version is fully generated data for sample purposes.<br/>Technologies: Typescript, React, Next.js, Leaflet, GeoJSON, Google Places API</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
