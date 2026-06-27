import { cn } from '@/lib/utils';
import { type Fragment, type MessageType } from '@prisma/client'
import React from 'react'
import { format } from "date-fns";
import Image from 'next/image';
import FragmentCard from './fragment-card';

interface Props {
    content: string,
    fragment: Fragment | null,
    createdAt: Date,
    isActiveFragment: boolean,
    onFragmentClick: () => void;
    type: MessageType;
}



const AssistantMessage = ({
    content,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
}: Props) => {
    return (
        <div
            className={cn(
                "flex flex-col group px-2 pb-4",
                type === "ERROR" && "text-red-700 dark:text-red-500"
            )}
        >
            <div
                className='flex items-center gap-2 mb-2'
            >
                {/** Todo add Logo  */}
                <Image
                    src={"/logo.svg"}
                    alt='vibe'
                    width={18}
                    height={18}
                    className='shrink-0'
                />
                <span className='text-sm font-medium'>
                    Vibe
                </span>
                <span className='text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'>
                    {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
                </span>

            </div>
            <div
                className='pl-8.5 flex flex-col gap-y-4'
            >
                <span>{content}</span>
                {fragment && type === "RESULT" && (
                    <FragmentCard
                        fragment={fragment}
                        onFragmentClick={onFragmentClick}
                        isActiveFragment={isActiveFragment}
                    />
                )}
            </div>
        </div>
    )
}

export default AssistantMessage