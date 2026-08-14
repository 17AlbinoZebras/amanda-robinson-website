'use client'
import React, { useState } from 'react'

import styles from './styles/projects.module.css'
import { TintedVector } from './mask_functions'

export default function Projects() {
    const [activeProject, setActiveProject] = useState<string>('shopcomp')

    const changeActiveProject= (proj: string) => {
        if (activeProject != proj) {
            setActiveProject(proj)
        }
    }

    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Red-Squiggles.svg" color='#FDBCBB' width='100vw' height='100vh' maskSize='cover' className={styles.projectsBackground}/>
            <span className={styles.heading}>Projects</span>
            <div className={styles.projects}>
                <div onClick={() => changeActiveProject('intervle')} className={`${styles.project} ${activeProject === 'intervle' ? styles.projectOpen : styles.projectClosed} ${styles.intervle}`}>
                    <span className={styles.projectTitle}>Intervle</span>
                    <div className={styles.projectContent}>
                        <div className={styles.preview}>
                            <img width='600' height='370' src='projects/intervle.jpg'/>
                        </div>
                        <div className={styles.description}><span>Intervle is a responsive web game inspired by everybody’s favorite word puzzle, Wordle, but with a lexicographic twist. Results indicate alphabetical distance from the target word in either direction for each letter position<br/>Technologies: HTML, CSS, JavaScript (Bootstrap)</span></div>
                    </div>
                </div>
                <div onClick={() => changeActiveProject('shopcomp')} className={`${styles.project} ${activeProject === 'shopcomp' ? styles.projectOpen : styles.projectClosed} ${styles.shopcomp}`}>
                    <span className={styles.projectTitle}>ShopComp</span>
                    <div className={styles.projectContent}>
                        <div className={styles.preview}>
                            <video width='650' height='370' src='projects/shopcomp-functionality.mp4' controls controlsList="nodownload" muted/>
                        </div>
                        <div className={styles.description}><span>Shopcomp is a full-stack grocery comparison web app enabling users to upload/manage receipts, maintain shopping lists, and compute best-price options from historical purchase data using a MySQL relational schema. In my team, I was responsible for the shopping list and calculation functionality shown above for our Software Engineering final project. Additionally, I designed and refactored database schema and developed complex queries.<br/>Technologies: Next.js, React, TypeScript, AWS Amplify/Cognito, AWS CDK, MySQL</span></div>
                    </div>
                </div>
                <div onClick={() => changeActiveProject('heatmap')} className={`${styles.project} ${activeProject === 'heatmap' ? styles.projectOpen : styles.projectClosed} ${styles.heatmap}`}>
                    <span className={styles.projectTitle}>Heatmap</span>
                    <div className={styles.projectContent}>
                        <div className={styles.preview}>
                            <img height='370' src='projects/heatmap.jpg'/>
                        </div>
                        <div className={styles.description}><span>A dynamic heatmap representation of hospital outreach statistics based on a variety of data. The currently displayed version is fully generated data for sample purposes.<br/>Technologies: Typescript, React, Next.js, Leaflet, GeoJSON, Google Places API, Claude Code</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
