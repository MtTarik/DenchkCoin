"use client"
import { useState } from 'react';
import Image from 'next/image';
import styles from './MultiTouchClickerGame.module.css';
import Header from "@/components/Header/Header";
import {
    ImpactOccurredFunction,
    useHapticFeedback,
} from '@altiore/twa';

interface TouchPoint {
    id: number;
    x: number;
    y: number;
}

const MultiTouchClickerGame: React.FC = () => {
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
    const [totalScore, setTotalScore] = useState<number>(0);

    const [style, setStyle] = useState<Parameters<ImpactOccurredFunction>[0]>('light');
    const { impactOccurred, notificationOccurred, selectionChanged } = useHapticFeedback();

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();

        const touches = event.touches;
        const coinRect = event.currentTarget.getBoundingClientRect();

        const newTouchPoints: TouchPoint[] = Array.from(touches).map((touch, index) => ({
            id: Date.now() + index,
            x: touch.clientX - coinRect.left,
            y: touch.clientY - coinRect.top,
        }));

        setTouchPoints((prevTouchPoints) => [...prevTouchPoints, ...newTouchPoints]);

        setCurrentScore((prevScore) => {
            const newScore = prevScore + touches.length;
            setTotalScore((prevTotalScore) => prevTotalScore + touches.length);
            return newScore;
        });

        // Trigger impact feedback with current style state
        impactOccurred(style);
    };

    const handleTouchEnd = () => {
        // Trigger notification feedback with current style state
        notificationOccurred('success');
    };

    const handleSelectionChange = () => {
        // Trigger selection changed feedback with current style state
        selectionChanged();
    };

    return (
        <div className={styles.gameContainer}>

            <Header />

            <div className={styles.buttonContainer} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className={styles.coinButton}>
                    <div className={styles.coinContainer}>
                        <Image
                            className={styles.coin}
                            draggable={false}
                            src="/coin.png"
                            alt="Coin"
                            width={100}
                            height={100}
                        />
                        {touchPoints.map((point) => (
                            <div
                                key={point.id}
                                className={styles.touchPoint}
                                style={{ left: point.x - 50, top: point.y - 50 }}
                            >
                                +1
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className={styles.totalScore}>
                Total Score: {totalScore}
            </div>
        </div>
    );
};

export default MultiTouchClickerGame;
