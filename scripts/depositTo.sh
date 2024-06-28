#!/bin/bash
caller=$1
to=$2
token=$3
amount=$4

dfx canister call --identity $callers core depositTo '(
  (principal "'$(dfx canister id ${token})'"), (principal "'${to}'"), '${amount}'
)'
