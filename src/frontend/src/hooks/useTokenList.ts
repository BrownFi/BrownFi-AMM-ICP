import { useCoreQueryCall } from "./coreActor";
import { TokenDetails } from "../model/tokens";
import { useEffect, useMemo } from "react";

export function useTokenList() {
  const { call, data, error, loading } = useCoreQueryCall({
    functionName: "getTokenList",
    args: [],
    refetchInterval: 100_000,
    refetchOnMount: false,
    // onLoading: () => console.log("Loading..."),
    // onSuccess: (data) => console.log("Success!", data),
    // onError: (error) => console.log("Error!", error),
  });

  useEffect(() => {
    call(); 
  }, []);

  let tokens: TokenDetails[] = [];
  if (!data) {
    tokens = []
  } else {
    tokens = data.map((token) => {
      return {
        address: token.id,
        decimals: token.decimals,
        logoURI: "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png",
        name: token.name,
        symbol: token.symbol,
      }
    })

    
  }

  return { tokens, error, loading: loading }
}