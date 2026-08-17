'use client'
import React, { useEffect, useState } from 'react'

import styles from './styles/projects.module.css'
import { TintedVector } from './mask_functions'

export default function Projects() {
    const [activeProject, setActiveProject] = useState<string>('heatmap')

    const changeActiveProject= (proj: string) => {
        if (activeProject != proj) {
            setActiveProject(proj)
        }
    }

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
        setPreviewExpanded((expanded) => !expanded)
    }

    // Guards the title <a>'s own navigation on a click that's opening the
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

    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Red-Squiggles.svg" color='#FDBCBB' width='100vw' height='100vh' maskSize='cover' className={styles.projectsBackground}/>
            <span className={styles.heading}>Projects</span>
            <div className={styles.projects}>
                <div onClick={() => changeActiveProject('intervle')} className={`${styles.project} ${activeProject === 'intervle' ? styles.projectOpen : styles.projectClosed} ${styles.intervle}`}>
                    {/* Always an <a>, never swapped for a <span> — conditionally
                        rendering a different element type (as this used to
                        do) unmounts and remounts on every open/close, and a
                        CSS transition can't play across that boundary (no
                        previous state to interpolate from), so the title
                        just snapped instead of transitioning smoothly like
                        ShopComp's (always a single, unchanging <span>).
                        href/target/rel are only set while open, so it's
                        inert (same as a plain span) while closed. */}
                    <a
                        href={activeProject === 'intervle' ? 'https://intervle-wordle-game.vercel.app/' : undefined}
                        target={activeProject === 'intervle' ? '_blank' : undefined}
                        rel={activeProject === 'intervle' ? 'noopener noreferrer' : undefined}
                        onClick={guardTitleLink('intervle')}
                        className={`${styles.projectTitle} ${activeProject === 'intervle' ? styles.openTitle : ''}`}
                    >
                        Intervle
                    </a>
                    <div className={`${styles.projectContent} ${previewExpanded ? styles.previewExpanded : ''}`}>
                        <div className={styles.preview}>
                            <div className={styles.previewMedia}>
                                <iframe src="https://intervle-wordle-game.vercel.app/" title="Intervle: A Wordle Spin-off" className={styles.webPreview} width="600" height="370"/>
                                {/* <img width='600' height='370' src='projects/intervle.jpg'/> */}
                            </div>
                            <button type="button" className={styles.expandToggle} onClick={toggleExpandPreview} aria-label={previewExpanded ? 'Show description' : 'Expand preview'}/>
                        </div>
                        <div className={styles.description}><span>My first real web design project back in 2023, Intervle is a responsive web game inspired by everybody&#39;s favorite word puzzle, Wordle, but with a lexicographic twist. Results indicate alphabetical distance from the target word in either direction for each letter position.<br/>Technologies: HTML, CSS, JavaScript (Bootstrap)</span></div>
                    </div>
                </div>
                <div onClick={() => changeActiveProject('shopcomp')} className={`${styles.project} ${activeProject === 'shopcomp' ? styles.projectOpen : styles.projectClosed} ${styles.shopcomp}`}>
                    <span className={styles.projectTitle}>ShopComp</span>
                    <div className={`${styles.projectContent} ${previewExpanded ? styles.previewExpanded : ''}`}>
                        <div className={styles.preview}>
                            <div className={styles.previewMedia}>
                                <video className={styles.webPreview} width='650' height='370' src='projects/shopcomp-functionality.mp4' controls controlsList="nodownload" muted/>
                            </div>
                            <button type="button" className={styles.expandToggle} onClick={toggleExpandPreview} aria-label={previewExpanded ? 'Show description' : 'Expand preview'}/>
                        </div>
                        <div className={styles.description}><span>Shopcomp is a full-stack grocery comparison web app enabling users to upload/manage receipts, maintain shopping lists, and compute best-price options from historical purchase data using a MySQL relational schema. In my team, I was responsible for the shopping list and calculation functionality shown above for our Software Engineering final project. Additionally, I designed and refactored database schema and developed complex queries.<br/>Technologies: Next.js, React, TypeScript, AWS Amplify/Cognito, AWS CDK, MySQL</span></div>
                    </div>
                </div>
                <div onClick={() => changeActiveProject('heatmap')} className={`${styles.project} ${activeProject === 'heatmap' ? styles.projectOpen : styles.projectClosed} ${styles.heatmap}`}>
                    {/* Always an <a>, never swapped for a <span> — see the
                        same note on Intervle's title above. */}
                    <a
                        href={activeProject === 'heatmap' ? 'https://patient-heatmap-public.vercel.app/' : undefined}
                        target={activeProject === 'heatmap' ? '_blank' : undefined}
                        rel={activeProject === 'heatmap' ? 'noopener noreferrer' : undefined}
                        onClick={guardTitleLink('heatmap')}
                        className={`${styles.projectTitle} ${activeProject === 'heatmap' ? styles.openTitle : ''}`}
                    >
                        Heatmap
                    </a>
                    <div className={`${styles.projectContent} ${previewExpanded ? styles.previewExpanded : ''}`}>
                        <div className={styles.preview}>
                            <div className={styles.previewMedia}>
                                {/* <img height='370' src='projects/heatmap.jpg'/> */}
                                <iframe src="https://patient-heatmap-public.vercel.app/" title="Hospital Outreach Heatmap" className={styles.webPreview} width="600" height="370"/>
                            </div>
                            <button type="button" className={styles.expandToggle} onClick={toggleExpandPreview} aria-label={previewExpanded ? 'Show description' : 'Expand preview'}/>
                        </div>
                        <div className={styles.description}><span>A dynamic heatmap representation of hospital outreach statistics based on a variety of data. The currently displayed version is fully generated data for sample purposes.<br/>Technologies: Typescript, React, Next.js, Leaflet, GeoJSON, Google Places API, Claude Code</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
