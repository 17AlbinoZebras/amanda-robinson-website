import React from 'react'

import styles from './styles/experience.module.css'
import { TintedVector } from './mask_functions'

export default function Experience() {
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Green-Memphis.svg" color='#729E8C' width='100vw' height='100vh' maskSize='cover' className={styles.experienceBackground}/>
            <span className={styles.heading}>Experience</span>
        </div>
    )
}
