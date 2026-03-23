import { inngest } from "@/inngest/client";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "../init";
import { prisma } from "@/db";

export const appRouter = createTRPCRouter({
  testai: premiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });
    return { success: true, message: "jobs queued" };
  }),

  getWorkflow: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "furkan@mail.com",
      },
    });
    return { success: true, message: "jobs queued" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
