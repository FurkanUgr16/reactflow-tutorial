import { credentialParams } from "../params";
import { useQueryStates } from "nuqs";

export const useCredentialParams = () => {
  return useQueryStates(credentialParams);
};
