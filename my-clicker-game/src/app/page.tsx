"use client"

import { Button } from 'antd'; // Або інша бібліотека кнопок, яку ви використовуєте
import MultiTouchClickerGame from '@/components/MultiTouchClickerGame';
import Head from 'next/head';
import { ImpactOccurredFunction, useHapticFeedback } from '@vkruglikov/react-telegram-web-app'; // Імпортуємо функції для вібрації
import styles from './page.module.css';

export default function Home() {
    const [impactOccurred] = useHapticFeedback(); // Хук для виклику вібрації

    const handleClick = () => {
        impactOccurred('medium'); // Викликаємо вібрацію з типом 'medium'
    };

    return (
        <main className={styles.main}>
            <div>
                <Head>
                    <title>Клікер Гра для Сенсорного Екрану</title>
                    <meta name="description" content="Проста клікер гра для сенсорного екрану на Next.js" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main>
                    <MultiTouchClickerGame />
                    <Button type="primary" onClick={handleClick}>
                        Натисніть, щоб вібрувати
                    </Button>
                </main>
            </div>
        </main>
    );
}
