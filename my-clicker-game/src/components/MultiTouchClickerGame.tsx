"use client"
import { Button, Form, Typography, Select } from 'antd';
import { useState } from 'react';
import {
    ImpactOccurredFunction,
    NotificationOccurredFunction,
    useHapticFeedback,
} from '@vkruglikov/react-telegram-web-app';

interface TouchPoint {
    id: number;
    x: number;
    y: number;
}

const MultiTouchClickerGame: React.FC = () => {
    const [impactOccurred] = useHapticFeedback();

    const handleClick = () => {
        impactOccurred('medium'); // Тип вібрації може бути 'light', 'medium', 'heavy', 'rigid', 'soft'
    };

    return (
        <Button type="primary" onClick={handleClick}>
            Натисніть, щоб вібрувати
        </Button>
    );
};
export default MultiTouchClickerGame;
