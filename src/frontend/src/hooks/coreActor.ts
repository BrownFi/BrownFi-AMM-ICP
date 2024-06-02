import { createActorContext } from "@ic-reactor/react";
import { core, idlFactory } from "../../../declarations/core";
import { createReactorCore } from "@ic-reactor/core";
import { agentManger } from "./config";

export type Core = typeof core

export const {
  ActorProvider: CoreActorProvider,
  useQueryCall: useCoreQueryCall,
  useUpdateCall: useCoreUpdateCall,
} = createActorContext<Core>({
  idlFactory,
})

export const coreReactor = createReactorCore<Core>({
  canisterId: `${import.meta.env.CANISTER_ID_CORE}`,
  idlFactory,
  withProcessEnv: true, // Utilizes process.env.DFX_NETWORK
  agentManager: agentManger,
})