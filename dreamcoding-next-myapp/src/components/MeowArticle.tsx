'use client'

import { useEffect, useState } from 'react';
import styles from './MeowArticle.module.css';

export default function MeowArticle() {
    const [text, setText] = useState('데이터 준비중...');

    useEffect(() => {
        fetch('https://meowfacts.herokuapp.com', {
            // next: { revalidate: 3 }, // ISR
            // next: { revalidate: 0 }, // SSR
            // cache: 'force-cache', // SSG, 영원히 캐시가 되기 때문
            // cache: 'no-store', // SSR
        })
            .then(res => res.json())
            .then(data => setText(data.data[0]));
    }, []);

    return <article className={styles.article}>{text}</article>
}