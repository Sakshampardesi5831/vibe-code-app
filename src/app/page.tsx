'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const Home = () => {
  const [value, setValue] = useState('')
  const router = useRouter();
  const trpc = useTRPC();
  // const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess: (data) => {
      toast.success('Project created successfully!');
      router.push(`/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error('Error creating project');
    }
  }));
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: (data) => {
      toast.success('Message created successfully!');
    }
  }));

  function clickMe() {
    if (!value.trim()) return;
    createProject.mutate({ value });
    //createMessage.mutate({ value });
  }

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center gap-4'>
      <div
        className='max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center '
      >
        <Input
          placeholder='Enter a prompt...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && clickMe()}
        />
        <Button onClick={clickMe} disabled={createProject.isPending}>
          {createProject.isPending ? 'Creating...' : 'Create'}
        </Button>
        {/* {JSON.stringify(messages, null, 2)} */}

      </div>

    </div>
  )
}

export default Home
