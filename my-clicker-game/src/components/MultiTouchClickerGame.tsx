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

    const handleClick = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
        impactOccurred(style);
    };

    return (
        <Button type="primary" onClick={() => handleClick('medium')}>
            Натисніть, щоб вібрувати (medium)
        </Button>
    );
};
export default MultiTouchClickerGame;
