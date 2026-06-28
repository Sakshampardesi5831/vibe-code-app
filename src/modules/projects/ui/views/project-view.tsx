'use client'
import React, { Suspense, useState } from 'react';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessagesContainer from '../components/messages-container';
import { Fragment } from '@prisma/client';
import ProjectHeader from '../components/project-header';
import FragmentWeb from '../components/fragment-web';
interface Props {
    projectId: string
}
const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    return (
        <div
            className='h-screen'
        >
            <ResizablePanelGroup>
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className='flex flex-col min-h-0'

                >
                    <Suspense fallback={<p>Loading.... </p>}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>

                    <Suspense fallback={<div>Loading messages...</div>}>
                        <MessagesContainer projectId={projectId} activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>

                </ResizablePanel>
                <ResizableHandle
                    withHandle

                />
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                   {!!activeFragment && <FragmentWeb
                     data = {activeFragment}
                   />}
                </ResizablePanel>
            </ResizablePanelGroup>

        </div>
    )
}

export default ProjectView