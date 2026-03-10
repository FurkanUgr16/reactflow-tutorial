"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Log out successfully");
              router.push("login");
            },
          },
        })
      }
      className="cursor-pointer"
      variant={"destructive"}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
