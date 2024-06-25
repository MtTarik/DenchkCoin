"use client"
import {useEffect, useState} from 'react';
import Image from 'next/image';
import styles from './MultiTouchClickerGame.module.css';
import Header from "@/components/Header/Header";

interface TouchPoint {
    id: number;
    x: number;
    y: number;
}

const MultiTouchClickerGame: React.FC = () => {
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
    const [totalScore, setTotalScore] = useState<number>(0);
    useEffect(() => {
        const preventZoomAndScroll = (event: TouchEvent) => {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        };

        document.addEventListener('touchmove', preventZoomAndScroll, { passive: false });

        return () => {
            document.removeEventListener('touchmove', preventZoomAndScroll);
        };
    }, []);
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

        if (navigator.vibrate) {
            navigator.vibrate(50); // Вібрація на 50 мс
        }
    };

    return (
        <div className={styles.gameContainer}>
            <Header />

            <div className={styles.buttonContainer} onTouchStart={handleTouchStart}>
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
                DHT: {totalScore}
            </div>
        </div>
    );
};

export default MultiTouchClickerGame;
