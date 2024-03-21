import { createReactor } from "@ic-reactor/react";
import { idlFactory } from "../../../declarations/token1";
import { styled } from "styled-components";
import { colors, theme } from "../theme";
import AppBody from "../AppBody";
import SwapHeader from "./SwapHeader";
import Row, { RowFixed } from "./Row";

const LightDiv = styled.div`
    color: ${colors().text1};
`
export const Wrapper = styled.div`
  position: relative;
  padding: 26px 25px 26px;
`;
export default function Swap() {
    // const { useQueryCall, useAuthState } = createReactor({
    //     canisterId: import.meta.env.CANISTER_ID_TOKEN1,
    //     idlFactory,
    //     host: "http://localhost:8080",
    // });

    // const { call, data, loading, error } = useQueryCall({
    //     functionName: "icrc1_balance_of",
    //     args: [{ owner: "", subaccount: [] }],
    //     refetchInterval: 1000,
    //     refetchOnMount: true,
    //     onLoading: () => console.log("Loading..."),
    //     onSuccess: (data) => console.log("Success!", data),
    //     onError: (error) => console.log("Error!", error),
    // })

    return (
        <>
            <AppBody>
                <SwapHeader />
                <Wrapper id='swap-page'>
                </Wrapper>
            </AppBody>
        </>
    );
}
