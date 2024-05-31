import { createActorContext, useAuth } from "@ic-reactor/react"
import { core, idlFactory } from "../../../declarations/core"
import { useEffect } from "react";

export type Core = typeof core

export const {
  ActorProvider: CoreActorProvider,
  useQueryCall: useCoreQueryCall,
  useUpdateCall: useCoreUpdateCall,
} = createActorContext<Core>({
  idlFactory,
})

export function useFetchPairList() {
  const { authenticated, identity } = useAuth();

  const { call, data, error, loading } = useCoreQueryCall({
    functionName: "getPairListByCreator",
    args: [identity?.getPrincipal()],
    refetchInterval: 100_000,
    refetchOnMount: true,
    onLoading: () => console.log("Loading..."),
    onSuccess: (data) => console.log("Success!", data),
    onError: (error) => console.log("Error!", error),
  })

  useEffect(() => {
    if (authenticated) {
      call()
    }
  }, [authenticated])

  return { authenticated, data, error, loading }
}