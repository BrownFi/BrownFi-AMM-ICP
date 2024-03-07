#!/bin/bash
dfx canister create BrownFi_Core
dfx deploy BrownFi_Core --argument="(principal \"$(dfx identity get-principal)\")"

