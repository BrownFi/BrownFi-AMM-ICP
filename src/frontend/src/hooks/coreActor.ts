import { createActorContext } from "@ic-reactor/react";
import { core, idlFactory } from "../../../declarations/core";

export type Core = typeof core

export const {
  ActorProvider: CoreActorProvider,
  useQueryCall: useCoreQueryCall,
  useUpdateCall: useCoreUpdateCall,
} = createActorContext<Core>({
  idlFactory,
})