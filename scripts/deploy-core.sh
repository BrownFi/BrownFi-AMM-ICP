#!/bin/bash
dfx canister create core
dfx deploy core --argument="(
  principal \"$(dfx identity get-principal)\",
  principal \"$(dfx canister id core)\",
  principal \"$(dfx canister id router)\"
)"

