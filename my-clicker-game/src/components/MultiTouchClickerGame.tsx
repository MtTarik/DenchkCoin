"use client"
import { Button, Form, Typography, Select } from 'antd';
import { FC, useState } from 'react';
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
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
    const [style, setStyle] = useState<Parameters<ImpactOccurredFunction>[0]>('light');
    const [type, setType] = useState<Parameters<NotificationOccurredFunction>[0]>('error');

    return (
        <>
            <Typography.Title level={3}>useHapticFeedback</Typography.Title>
            <Form
                labelCol={{ span: 6 }}
                name="HapticFeedbackDemo"
                layout="horizontal"
                autoComplete="off"
            >
                <Form.Item label="style">
                    <Select value={style} onChange={value => setStyle(value as Parameters<ImpactOccurredFunction>[0])}>
                        <Select.Option value="light">light</Select.Option>
                        <Select.Option value="medium">medium</Select.Option>
                        <Select.Option value="heavy">heavy</Select.Option>
                        <Select.Option value="rigid">rigid</Select.Option>
                        <Select.Option value="soft">soft</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" onClick={() => impactOccurred(style)}>
                        impactOccurred
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" onClick={() => selectionChanged()}>
                        selectionChanged
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
export default MultiTouchClickerGame;
