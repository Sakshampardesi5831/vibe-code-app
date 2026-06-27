import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ ctx }) => {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        })
        return projects
    }),
    create: baseProcedure.input(
        z.object({
            value: z.string().min(1, { message: "Message is required" }).max(10000, { message: "Message must be less than 1000 characters" })
        })
    ).mutation(async ({ input, ctx }) => {
        const slug = generateSlug(2, { format: "kebab" });
        const createdProject = await prisma.project.create({
            data: {
                name: slug,
                messages: {
                    create: {
                        content: input.value,
                        role: "USER",
                        type: "RESULT"
                    }
                }
            }
        })
        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.value,
                projectId: createdProject.id
            }
        })


        return createdProject
        // const newMessage = await prisma.message.create({
        //     data: {
        //         content: input.value,
        //         role: "USER",
        //         type: "RESULT"
        //     }
        // })

        // return newMessage
    }),
    getOne: baseProcedure
        .input(z.object({ id: z.string().min(1, { message: "Message ID is required" }) }))
        .query(async ({ input }) => {
            const existingProject = await prisma.project.findUnique({
                where: {
                    id: input.id
                }
            })
            if (!existingProject) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found"
                });
            }
            return existingProject;
        })
})