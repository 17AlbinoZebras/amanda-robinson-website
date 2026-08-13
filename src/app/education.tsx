import React from 'react'

import styles from './styles/education.module.css'
import { TintedVector } from './mask_functions'

export default function Education() {
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Blue-Squiggles.svg" color='#61659B' width='100vw' height='100vh' maskSize='cover' className={styles.educationBackground}/>
            <span className={styles.heading}>Education</span>
        </div>
    )
}
