'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useTRPC } from '@/trpc/client'
// import { useQuery } from '@tanstack/react-query'
const Home = () => {
  const trpc = useTRPC();
  trpc.hello.queryOptions({text:"Hello world"});
  return (
    <div>
      Home
      <Button>Click me</Button>
    </div>
  )
}

export default Home