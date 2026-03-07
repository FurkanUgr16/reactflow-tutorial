import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen min-w-screen gap-4 flex items-center justify-center">
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
  );
}
