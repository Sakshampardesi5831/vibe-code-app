import { type MessageRole, type MessageType, type Fragment } from '@prisma/client';
import React from 'react'
import UserMessage from './user-message';
import AssistantMessage from './assistant-message';
interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isActive: boolean;
    onFragmentClick: () => void;
    type: MessageType;
}
const MessageCard = ({ content, role, fragment, createdAt, isActive, onFragmentClick, type }: MessageCardProps) => {

    if (role === "ASSISTANT") {
        return (
            <AssistantMessage
                content={content}
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActive}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }
    return (
        <UserMessage content={content} />
    )
}

export default MessageCard