import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSubscription = () => {
  const { data: userSession } = authClient.useSession();
  const userId = userSession?.user.id;
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
    enabled: !!userId,
  });
};

export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  const hasActiveSubscription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    subscription: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
