import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
    create: baseProcedure.input(
        z.object({
             value: z.string().min(1, { message: "Message is required" })
             .max(10000, { message: "Message must be less than 1000 characters" }),
             projectId:z.string().min(1, { message: "Project ID is required" })
        })
    ).mutation(async ({ input, ctx }) => {
        const newMessage = await prisma.message.create({
            data: {
                projectId: input.projectId,
                content: input.value,
                role: "USER",
                type: "RESULT"
            }
        })
        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.value,
                projectId: input.projectId
            }
        })
        return newMessage
    }),
    getMany: baseProcedure.query(async ({ ctx }) => {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: "desc" },
        })
        return messages
    })
})