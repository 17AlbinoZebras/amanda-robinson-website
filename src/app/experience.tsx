import React from 'react'

import styles from './styles/experience.module.css'
import { TintedVector } from './mask_functions'

export default function Experience() {
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Green-Memphis.svg" color='#729E8C' width='100vw' height='100vh' maskSize='cover' className={styles.experienceBackground}/>
            <span className={styles.heading}>Work Experience</span>
            <div className={styles.mainBody}>
                <div className={`${styles.section} ${styles.sectionLeft} ${styles.sfpti1}`}>
                    <span className={styles.sectionTitle}>South Florida Proton Therapy Institute</span>
                    <ul className={styles.sectionBody}>
                        <li>Created an application to automate the download of MRI and CT scans</li>
                        <li>Harnessed the Varian medical database to isolate relevant data while ensuring HIPAA-compliance</li>
                        <li>Technologies: SQL Server, SQL, DICOM, Java, Python</li>
                    </ul>
                </div>
                <div className={`${styles.section} ${styles.sectionRight} ${styles.sfpti2}`}>
                    <span className={styles.sectionTitle}>South Florida Proton Therapy Institute (Contd.)</span>
                    <ul className={styles.sectionBody}>
                        <li>Applied software engineering fundamentals to build a dynamic heatmap representation of company and national statistics from numerous sources</li>
                        <li>Technologies: Typescript, React, Next.js, Leaflet, GeoJSON, Google Places API, Claude Code</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
