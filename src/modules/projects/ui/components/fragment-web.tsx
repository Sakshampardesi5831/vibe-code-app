import { Fragment } from '@prisma/client';
import React, { useState } from 'react';
import {
    ExternalLink,
    RefreshCcw
} from "lucide-react";
import { Button } from '@/components/ui/button';
import Hint from '@/components/hint';
interface Props {
    data: Fragment
}
const FragmentWeb = ({ data }: Props) => {

    const [fragmemtKey, setFragmemtKey] = useState(0);
    const [copied, setCopied] = useState(false);
    const onRefresh = () => {
        setFragmemtKey((prev) => prev + 1)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl)
        setCopied(true);
        setTimeout(() => { setCopied(false) }, 2000)
    }

    return (
        <div
            className='flex flex-col w-full h-full'
        >
            <div
                className='p-2 border-b bg-sidebar flex items-center gap-x-2 '
            >
                <Hint
                    text='refresh'
                    align='start'
                    side='bottom'
                >
                    <Button
                        size={"sm"}
                        variant={"outline"}
                        onClick={onRefresh}
                    >
                        <RefreshCcw />
                    </Button>
                </Hint>

                <Hint text='click to copy' align='start' side='top'>
                    <Button
                        size={"sm"}
                        variant={"outline"}
                        onClick={handleCopy}
                        disabled={!data.sandboxUrl || copied}
                        className='flex-1 justify-start text-start font-normal '
                    >
                        <span
                            className='truncate'
                        >{data.sandboxUrl}</span>
                    </Button>

                </Hint>

                <Hint side='bottom' align='start' text='Open in a New Tab'>
                    <Button
                        size={"sm"}
                        disabled={!data.sandboxUrl}
                        variant={"outline"}
                        onClick={() => {
                            if (!data.sandboxUrl) return;
                            window.open(data.sandboxUrl, "_blank");
                        }}
                    >
                        <ExternalLink />
                    </Button>
                </Hint>
            </div>
            <iframe
                key={fragmemtKey}
                src={data.sandboxUrl} className='h-full w-full'
                sandbox='allow-forms allow-scripts allow-same-origin'
                loading='lazy'
            ></iframe>
        </div>
    )
}

export default FragmentWeb