import { useAuth } from "@ic-reactor/react";
import { useEffect } from "react";
import { useCoreQueryCall } from "./coreActor";
import { PositionDetails } from "../model/pools";
import { Principal } from "@dfinity/principal";

export function usePositions() {
    const { authenticated, identity } = useAuth();

    const { call, data, error, loading } = useCoreQueryCall({
      functionName: "getPairListByCreator",
      args: [Principal.fromText("medlw-2c5pb-n4eht-4f3js-vtrp7-2juyk-smdl5-xitl6-x7ezi-dm5wx-cae")],
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