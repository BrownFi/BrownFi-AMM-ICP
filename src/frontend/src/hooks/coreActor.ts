import { createActorContext, useAuth } from "@ic-reactor/react"
import { core, idlFactory } from "../../../declarations/core"
import { useEffect } from "react";
import { PoolDetails } from "../model/pools";

export type Core = typeof core

export const {
  ActorProvider: CoreActorProvider,
  useQueryCall: useCoreQueryCall,
  useUpdateCall: useCoreUpdateCall,
} = createActorContext<Core>({
  idlFactory,
})