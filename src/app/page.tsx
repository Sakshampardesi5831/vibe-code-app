'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const Home = () => {
  const [value, setValue] = useState('')
  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: (data) => {
      toast.success('Message created successfully!');
    }
  }));

  function clickMe() {
    if (!value.trim()) return;
    createMessage.mutate({ value });
  }

  return (
    <div className='p-4 max-w-7xl mx-auto flex gap-2'>
      <Input
        placeholder='Enter a prompt...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && clickMe()}
      />
      <Button onClick={clickMe} disabled={createMessage.isPending}>
        {createMessage.isPending ? 'Creating...' : 'Create'}
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  )
}

export default Home
