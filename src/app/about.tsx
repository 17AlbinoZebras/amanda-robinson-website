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
                        <img src="about/AmandaHeadshot8ML.jpg" className={styles.headshot}></img>
                    </div>
                    <div className={styles.mainDescription}>
                        I&#39;m Amanda Robinson, a third year CS student at WPI. I grew up in San Jose, California, but I love to travel. I&#39;ve been coding my whole life, and I find the limitless possibilities to what I can build thrilling. To me, designing software is like solving a puzzle—finding new ways to approach old problems. My lifelong passion for logic puzzles has grown into a desire to develop creative solutions to tackle complex problems professionally as a product builder. 
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
