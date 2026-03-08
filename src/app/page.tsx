import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { caller } from "@/trpc/server";
export default async function Page() {
  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen gap-4 flex flex-col gap-y-6 items-center justify-center">
      {data.map((d) => d && <div key={d.id}>{JSON.stringify(d)}</div>)}
      <div className="flex gap-2">
        <div className={buttonVariants({ variant: "default" })}>
          <Link href={"/login"}>Login</Link>
        </div>
        <div>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={"/signup"}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
