import { createReactor } from "@ic-reactor/react";
import { idlFactory } from "../../../declarations/core";

function pairAdapter(pairList: any[], network = 'icp') {
    if (!pairList) return [];
    return pairList.map((pair) => {
        return {
            id: pair.id,
            token0: pair.bToken,
            token1: pair.qToken,
            name: `${pair.bToken}/${pair.qToken}`,
            symbol: `${pair.bToken}/${pair.qToken}`,
            address: pair.id,
            network,
            totalSupply: pair.totalSupply,
            reserve0: pair.bReserve,
            reserve1: pair.qReserve,
            reserveUSD: pair.qReserve,
            price: pair.qReserve / pair.bReserve,
            volumeUSD: 0,
            liquidity: pair.l,
            feeRate: pair.feeRate,
            k: pair.k,
            pLast: pair.pLast,
        }
    })
}

export default function useFetchPairList() {
    const { useQueryCall } = createReactor({
        canisterId: import.meta.env.CANISTER_ID_CORE,
        idlFactory,
        host: "http://localhost:8080",
    });

    const { call, data, loading, error, } = useQueryCall({
        functionName: "getPairList",
        args: [],
        refetchOnMount: true,
        onSuccess: (data) => console.log("Success!", data),
    })

    return {
        call,
        // @ts-expect-error data is valid
        data: pairAdapter(data),
        loading,
        error,
    }
};