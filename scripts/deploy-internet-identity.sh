#!/bin/bash
dfx canister create internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai
II_ENV=development dfx deploy internet_identity --specified-id rdmx6-jaaaa-aaaaa-aaadq-cai --no-wallet