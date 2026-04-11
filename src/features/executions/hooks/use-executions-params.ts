import { executionsParams } from "../params";
import { useQueryStates } from "nuqs";

export const useExecutionParams = () => {
  return useQueryStates(executionsParams);
};
