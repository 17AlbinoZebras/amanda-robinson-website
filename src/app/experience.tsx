import React from 'react'

import styles from './styles/experience.module.css'
import { TintedVector } from './mask_functions'

export default function Experience() {
    const sfptiRoleTitle = 'Software Intern'
    const sfptiDateRange = 'May\u2013Aug 2026'
    const sfptiRoleInfo = <h3 className={styles.roleInfo}>{sfptiRoleTitle} | {sfptiDateRange}</h3>
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Green-Memphis.svg" color='#729E8C' width='100vw' height='100vh' maskSize='cover' className={styles.experienceBackground}/>
            <header>
                <h1 className={styles.heading}>Work Experience</h1>
            </header>
            <div className={styles.mainBody}>
                <div className={`${styles.section} ${styles.sectionLeft} ${styles.sfpti1}`}>
                    <div className={styles.titleSection}>
                        
                        <h2 className={styles.employer}>South Florida Proton Therapy Institute</h2>
                        <h3 className={styles.projectName}>Imaging Download Automation</h3>
                    </div>
                    <ul className={styles.sectionBody}>
                        <li>Created an application to automate the download of MRI and CT scans, which was used to test a program that would provide patients a safer treatment process</li>
                        <li>Harnessed the Varian medical database to isolate relevant data while ensuring HIPAA-compliance</li>
                        <li>Technologies: SQL Server, SQL, DICOM, Java, Python</li>
                    </ul>
                    {sfptiRoleInfo}
                </div>
                <div className={`${styles.section} ${styles.sectionRight} ${styles.sfpti2}`}>
                    <div className={styles.titleSection}>
                        
                        <h2 className={styles.employer}>South Florida Proton Therapy Institute</h2>
                        <h3 className={styles.projectName}>Hospital Outreach Heatmap</h3>
                    </div>
                    <ul className={styles.sectionBody}>
                        <li>Applied software engineering fundamentals to build a dynamic heatmap representation of company and national statistics from numerous sources</li>
                        <li>Technologies: Typescript, React, Next.js, Leaflet, GeoJSON, Google Places API</li>
                    </ul>
                    {sfptiRoleInfo}
                </div>
            </div>
        </div>
    )
}
