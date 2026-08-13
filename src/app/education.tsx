'use client'

import React, { useState } from 'react'

import styles from './styles/education.module.css'
import { TintedVector } from './mask_functions'

export default function Education() {
    const classes: {title: string, code: string, url: string}[] = [
        {title: "Algorithms", code: "CS2223", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-2223"},
        {title: "Software Engineering", code: "CS3733", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-3733"},
        {title: "Database Systems", code: "CS3431", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-3431"},
        {title: "Data Science", code: "DS1010", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3846/data-science#DS-1010"},
        {title: "Operating Systems", code: "CS3013", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-3013"},
        {title: "Cryptography", code: "CS4801", url: "https://users.wpi.edu/~kmus/ECE4802.htm"},
        {title: "Machine Learning", code: "CS4342", url: "https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-4342"}
    ]

    const [hoveredCourseCode, setHoveredCourseCode] = useState<string | null>(null);

    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Blue-Squiggles.svg" color='#61659B' width='100vw' height='100vh' maskSize='cover' className={styles.educationBackground}/>
            <span className={styles.heading}>Education</span>
            <div className={styles.upperSection}>
                <div className={styles.overview}>
                    <div className={styles.column}>
                        <b>Worcester Polytechnic Institute</b>
                        <span>Expected Graduation: May 2028</span>
                    </div>
                    <div className={styles.column}>
                        <span>B.S. Computer Science</span>
                        <span>Minor in Economics</span>
                    </div>
                </div>
            </div>
            <div className={styles.lowerSection}>
                <span className={styles.subHeading}>Relevant Courses</span>
                <div className={styles.relevantCourses}>
                    <div className={styles.row}>
                        {classes.slice(0, 4).map((course) => (
                            <div key={course.code} className={styles.course} onMouseEnter={() => setHoveredCourseCode(course.code)} onMouseLeave={() => setHoveredCourseCode(null)}>
                                <a href={course.url} target="_blank" rel="noopener noreferrer">{hoveredCourseCode === course.code ? course.code : course.title}</a>
                            </div>
                        ))}
                    </div>
                    <div className={styles.row}>
                        {classes.slice(4).map((course) => (
                            <div key={course.code} className={styles.course} onMouseEnter={() => setHoveredCourseCode(course.code)} onMouseLeave={() => setHoveredCourseCode(null)}>
                                <a href={course.url} target="_blank" rel="noopener noreferrer">{hoveredCourseCode === course.code ? course.code : course.title}</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
