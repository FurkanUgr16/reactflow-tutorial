import { baseProcedure, createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(() => {
    return {
      //prisma.user.findmany()
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
