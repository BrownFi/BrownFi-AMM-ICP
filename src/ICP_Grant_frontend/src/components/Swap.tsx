// import { useInternetIdentity } from "ic-use-internet-identity";
// import styled from "styled-components";
// import { ButtonLight } from "./Button";
// import { AutoColumn } from "./Column";
// import ConnectWallet from "/images/connect-wallet.png";
// // import AppBody from "./AppBody";
// // import SwapHeader from "./SwapHeader";
// import {
//   ArrowWrapper,
//   BottomGrouping,
//   Dots,
//   SwapCallbackError,
//   Wrapper,
// } from "./styleds";

import { createReactor, useQueryCall } from "@ic-reactor/react";
import { useInternetIdentity } from "ic-use-internet-identity";
import { idlFactory } from "../../../declarations/token1";
import useActorManagers from "../hooks/useActorManagers";

// import CurrencyInputPanel, {
//   ShortcutAmount,
// } from "../../components/CurrencyInputPanel";

// const PageWrapper = styled(AutoColumn)`
//   width: 100%;
// `;

// export default function Swap() {
//   const { login, identity } = useInternetIdentity();

//   return (
//     <>
//       <AppBody>
//         <SwapHeader />
//         <Wrapper id="swap-page">
//           <AutoColumn gap={"md"}>
//             <div style={{ display: "relative" }}>
//               <CurrencyInputPanel
//                 label={
//                   independentField === Field.OUTPUT && !showWrap
//                     ? "From (at most)"
//                     : "From"
//                 }
//                 value={formattedAmounts[Field.INPUT]}
//                 showMaxButton={showMaxButton}
//                 showShortcutButtons={true}
//                 currency={currencies[Field.INPUT]}
//                 onUserInput={handleTypeInput}
//                 onMax={handleMaxInput}
//                 onShortcutAmount={handleHalfInput}
//                 fiatValue={fiatValueInput ?? undefined}
//                 onCurrencySelect={handleInputSelect}
//                 otherCurrency={currencies[Field.OUTPUT]}
//                 showCommonBases={true}
//                 id="swap-currency-input"
//               />

//               <CurrencyInputPanel
//                 value={formattedAmounts[Field.OUTPUT]}
//                 onUserInput={handleTypeOutput}
//                 label={
//                   independentField === Field.INPUT && !showWrap
//                     ? "To (at least)"
//                     : "To"
//                 }
//                 showMaxButton={false}
//                 hideBalance={false}
//                 fiatValue={fiatValueOutput ?? undefined}
//                 priceImpact={priceImpact}
//                 currency={currencies[Field.OUTPUT]}
//                 onCurrencySelect={handleOutputSelect}
//                 otherCurrency={currencies[Field.INPUT]}
//                 showCommonBases={true}
//                 id="swap-currency-output"
//               />
//             </div>
//           </AutoColumn>
//         </Wrapper>
//       </AppBody>
//     </>
//   );
// }

export default function Swap() {
    const { identity } = useInternetIdentity();
    const { useQueryCall } = createReactor({
        canisterId: import.meta.env.CANISTER_ID_TOKEN1,
        idlFactory,
        host: "http://localhost:8080",
    });

    identity?.getPrincipal()
    
    const { call, data, loading, error } = useQueryCall({
        functionName: "icrc1_balance_of",
        args: [{ owner: identity?.getPrincipal(), subaccount: [] }],
        refetchInterval: 1000,
        refetchOnMount: true,
        onLoading: () => console.log("Loading..."),
        onSuccess: (data) => console.log("Success!", data),
        onError: (error) => console.log("Error!", error),
    })

    return (
        <div>
            <h2>ICP Balance:</h2>
            <div>
                Loading: {loading.toString()}
                <br />
                Error: {error?.toString()}
                <br />
                balance:{" "}
                {data !== undefined
                    ? JSON.stringify(data, (_, v) =>
                        typeof v === "bigint" ? v.toString() : v
                    )
                    : null}
            </div>
            <button onClick={call}>Get Balance</button>
        </div>
    )
}
