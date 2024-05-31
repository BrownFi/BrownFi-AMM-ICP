import { Principal } from "@ic-reactor/core/dist/types";
import { useCoreUpdateCall } from "./coreActor";
import { useEffect } from "react";

export type AddLiquidityParams = {
  bToken: Principal;
  qToken: Principal;
  bAmount: number;
  qAmount: number;
};

export function useAddLiquidity({bToken, qToken, bAmount, qAmount}: AddLiquidityParams) {
  const { call: setPair } = useCoreUpdateCall({
    functionName: "setPair",
    args: [bToken, qToken],
  })

  useEffect(() => { setPair() }, [])

  const { call: addLiquidity } = useCoreUpdateCall({
    functionName: "addLiquidity",
    args: [bToken, qToken, BigInt(bAmount), BigInt(qAmount), BigInt("1741447837000000000")],
  });

  useEffect(() => { addLiquidity() }, [])
}