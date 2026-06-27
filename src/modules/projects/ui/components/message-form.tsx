import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { ArrowUp, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { z } from "zod"
import { useTRPC } from '@/trpc/client';
interface Props {
    projectId: string;
}


const formSchema = z.object({
    value: z.string().min(1, { message: "Message is required" })
        .max(10000, { message: "Message must be less than 1000 characters" }),
})



const MessageForm = ({ projectId }: Props) => {

    //const [showUsage, setShowUsage] = useState(false);

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: (data) => {
            form.reset();
            queryClient.invalidateQueries(
                trpc.messages.getMany.queryOptions({ projectId: projectId })
            )
        },
        // TODO :INVALIDATE USEAGE STATUS
        onError:(error)=>{
            //Todo rediect to pricing page
            toast.error(error.message)
        }
    }));
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: ""
        }
    })
    const [isFocused, setIsFocused] = useState(false);
    const showUsage = false;
    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        await createMessage.mutateAsync({
            value: values.value,
            projectId: projectId
        })
    }
    return (
        <Form
            {...form}
        >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("'relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all '", isFocused && "shadow-xs", showUsage && "rounded-t-none")}
            >
                <FormField
                    control={form.control}
                    name='value'
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            minRows={2}
                            maxRows={8}
                            className='pt-4 resize-none border-none w-full ouline-none bg-transparent'
                            placeholder='What would you like to build'
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)(e);
                                }
                            }}
                        />
                    )}
                />
                <div
                    className='flex gap-x-2 items-end justify-between pt-2 '
                >
                    <div
                        className='text-[10px] text-muted-foreground font-mono'
                    >
                        <kbd
                            className='ml-auto pointer-events-none inline-flex h-5 select-none item-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground '
                        >
                            ctrl + Enter
                        </kbd>
                        &nbsp;to submit
                    </div>
                    <Button
                        disabled={isButtonDisabled}
                        className={cn("size-8 rounded-full", isButtonDisabled && "bg-muted-foreground border")}
                    >
                        {isPending ? (<Loader2 className=' size-4 animate-spin' />) : (<ArrowUp />)}

                    </Button>
                </div>
            </form>

        </Form>
    )
}

export default MessageForm