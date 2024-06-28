import { icrc2, idlFactory } from "../../../declarations/icrc2";
import { Principal } from "@dfinity/principal";
import { coreReactor } from "./coreActor";
import { createReactorCore } from "@ic-reactor/core";
import { agentManger } from "./config";


export type Icrc2 = typeof icrc2
export function createTokenReactor<Icrc2>(cannisterId: string) {
  return createReactorCore<Icrc2>({
    canisterId: cannisterId,
    idlFactory,
    agentManager: agentManger,
  })
}

export function approve(tokenCannisterId: string, amount: bigint) {
  const reactor = createTokenReactor<Icrc2>(tokenCannisterId)
  const { call } = reactor.updateCall({
    functionName: "icrc2_approve",
    args: [
      {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount,
        expected_allowance: [],
        expires_at: [],
        spender: {
          owner: Principal.from(coreReactor.canisterId),
          subaccount: []
        },
      }
    ]
  });

  return call()
}