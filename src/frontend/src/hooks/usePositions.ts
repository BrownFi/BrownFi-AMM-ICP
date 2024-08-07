import { useAuth } from "@ic-reactor/react";
import { useEffect } from "react";
import { useCoreQueryCall } from "./coreActor";
import { PositionDetails } from "../model/pools";

export function usePositions() {
    const { authenticated, identity } = useAuth();

    const { call, data, error, loading } = useCoreQueryCall({
      functionName: "getPairList",
      args: [],
      refetchInterval: 100_000,
      refetchOnMount: true,
    })
  
    useEffect(() => {
      if (authenticated) {
        call()
      }
    }, [authenticated])
  
    let positions: PositionDetails[] = [];
    if (data === undefined) {
      positions = []
    } else {
      positions = data.map((pair) => {
        return {
          id: pair.id,
          tokenPay: pair.bToken,
          tokenReceive: pair.qToken,
          lpToken: pair.lpToken,
          isActive: true,
          parameter: {},
          currentLP: pair.totalSupply.toString(),
        }
      })
    }
  
    return { authenticated, positions, error, loading }
  }