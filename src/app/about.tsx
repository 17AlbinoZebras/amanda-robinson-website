import React from 'react'

import styles from './styles/about.module.css'
import { TintedVector } from './mask_functions'

export default function About() {
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Yellow-Memphis.svg" color='#FBDDA1' width='100vw' height='100vh' maskSize='cover' className={styles.aboutBackground}/>
            <span className={styles.heading}>About Me</span>
            <div className={styles.mainContent}>
                <div className={styles.upperSection}>
                    <div className={styles.mainPhoto}>
                        <img src="AmandaHeadshot8ML.jpg" className={styles.headshot}></img>
                    </div>
                    <div className={styles.mainDescription}>
                        Hi! I&#39;m Amanda, a third year CS student at WPI. I grew up in San Jose, California, but I&#39;m open to working anywhere. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    </div>
                </div>
                <div className={styles.lowerSection}>
                    <div className={styles.activities}>
                        <span className={styles.sectionTitle}>Activities & Leadership</span>
                        <ul>
                            <li>Alpha Gamma Delta Sorority | Interim VP New Member Experience</li>
                            <li>Masque Theatre | VP Props & Costumes</li>
                            <li>Women’s Club Rugby | PR Officer</li>
                            <li>Alpha Psi Omega Honor Society | Member</li>
                            <li>Student Alumni Society | Member</li>
                        </ul>
                    </div>
                    <div className={styles.hobbies}>
                        <span className={styles.sectionTitle}>Hobbies & Interests</span>
                        <ul>
                            <li>Photography</li>
                            <li>Theater</li>
                            <li>Logic Puzzles</li>
                            <li>Crafts</li>
                            <li>Board Games</li>
                            <li>Learning new skills</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
