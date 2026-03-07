import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Link className={buttonVariants({ variant: "default" })} href={"/login"}>
        Login
      </Link>
      <Link className={buttonVariants({ variant: "outline" })} href={"/signup"}>
        Sign Up
      </Link>
    </div>
  );
}
