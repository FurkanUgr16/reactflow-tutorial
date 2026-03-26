import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import UpgradeModal from "@/components/upgrade-modal";

const useUpgradeModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return { handleError, modal };
};

export default useUpgradeModal;
