import React from 'react'

import styles from './styles/projects.module.css'
import { TintedVector } from './mask_functions'

export default function Projects() {
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Red-Squiggles.svg" color='#FDBCBB' width='100vw' height='100vh' maskSize='cover' className={styles.projectsBackground}/>
            <span className={styles.heading}>Projects</span>
        </div>
    )
}
