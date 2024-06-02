import { useEffect } from "react";
import { TokenDetails } from "../model/tokens";
import { useCoreQueryCall, useCoreUpdateCall } from "./coreActor";
import { Principal } from "@ic-reactor/core/dist/utils/principal";

export type QuoteParams = {
  bToken: Principal;
  qToken: Principal;
  amount: number;
  onLoading?: () => void;
  onSuccess?: (data) => void;
  onError?: (error?: Error) => void;
};

export function useQuote({
  bToken,
  qToken,
  amount,
  onLoading,
  onSuccess,
  onError,
}: QuoteParams) {
  const { call, data, error, loading } = useCoreUpdateCall({
    functionName: "quote",
    args: [bToken, qToken, BigInt(amount)],
    onLoading: onLoading,
    onSuccess: onSuccess,
    onError: onError,
  });

  useEffect(() => {
    call();
  }, []);

  return { call, data, error, loading }
}