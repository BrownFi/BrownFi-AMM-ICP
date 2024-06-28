import { createAgentManager } from "@ic-reactor/core";

export const agentManger = createAgentManager({
    host: import.meta.env.DFX_NETWORK === "local" ? "http://localhost:4943" : "https://ic0.app",
});

export const IDENTITY_PROVIDER = import.meta.env.DFX_NETWORK === "local" ? 
    `http://${import.meta.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943#authorize` : 
    "https://identity.ic0.app#authorize";
