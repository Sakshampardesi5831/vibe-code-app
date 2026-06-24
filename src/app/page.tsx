'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'

const Home = () => {
  const [value, setValue] = useState('')
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}))

  function clickMe() {
    if (!value.trim()) return;
    invoke.mutate({ text: value })
  }

  return (
    <div className='p-4 max-w-7xl mx-auto flex gap-2'>
      <Input
        placeholder='Enter a prompt...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && clickMe()}
      />
      <Button onClick={clickMe} disabled={invoke.isPending}>
        {invoke.isPending ? 'Running...' : 'Run'}
      </Button>
    </div>
  )
}

export default Home
