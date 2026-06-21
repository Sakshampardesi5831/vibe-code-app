'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useTRPC } from '@/trpc/client'
// import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
const Home = () => {
  const trpc = useTRPC();
  // trpc.hello.queryOptions({text:"Hello world"});
  const invoke = useMutation(trpc.invoke.mutationOptions({}))
  function clickMe() {
    invoke.mutate({ text: "sakshampardesi5831@gmail.com" })
  }
  return (
    <div
      className='p-4 max-w-7xl mx-auto'
    >
      <Button
        onClick={() => clickMe()}
      >Click me</Button>
    </div>
  )
}

export default Home