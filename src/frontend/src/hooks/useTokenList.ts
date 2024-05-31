import { useCoreQueryCall } from "./coreActor";
import { TokenDetails } from "../model/tokens";
import { useMemo } from "react";

export function useTokenList() {
    const { call, data, error, loading } = useCoreQueryCall({
      functionName: "getTokenList",
      args: [],
      refetchInterval: 100_000,
      refetchOnMount: true,
      onLoading: () => console.log("Loading..."),
      onSuccess: (data) => console.log("Success!", data),
      onError: (error) => console.log("Error!", error),
    });
  
    useMemo(() => { call() }, [data])

    let tokens: TokenDetails[] = [];
    if (data === undefined) {
      tokens = []
    } else {
      console.log("###############", data)
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
  
    return { tokens, error, loading }
  }