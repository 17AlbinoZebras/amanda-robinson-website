import React from 'react'

import styles from './styles/about.module.css'
import { TintedVector } from './mask_functions'

export default function About() {
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Yellow-Memphis.svg" color='#FBDDA1' width='100vw' height='100vh' maskSize='cover' className={styles.aboutBackground}/>
            <span className={styles.heading}>About Me</span>
        </div>
    )
}
