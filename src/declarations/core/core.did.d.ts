import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BrownFi {
  'addLiquidity' : ActorMethod<
    [Principal, Principal, bigint, bigint, bigint],
    TxReceipt
  >,
  'balanceOf' : ActorMethod<[string, Principal], bigint>,
  'deposit' : ActorMethod<[Principal, bigint], TxReceipt>,
  'depositTo' : ActorMethod<[Principal, Principal, bigint], TxReceipt>,
  'getAmountIn' : ActorMethod<[Principal, Principal, bigint], TxReceipt>,
  'getCapSetting' : ActorMethod<[], CapSettings>,
  'getFeeTo' : ActorMethod<[], Principal>,
  'getOwner' : ActorMethod<[], Principal>,
  'getPair' : ActorMethod<[string, string], [] | [PairInfoExt]>,
  'getPairList' : ActorMethod<[], Array<PairInfoExt>>,
  'getPairListByCreator' : ActorMethod<[Principal], Array<PairInfoExt>>,
  'getTokenList' : ActorMethod<[], Array<TokenInfoExt>>,
  'getTokenMetadata' : ActorMethod<[string], TokenAnalyticsInfo>,
  'getUserInfo' : ActorMethod<[Principal], UserInfo>,
  'setCapId' : ActorMethod<[Principal], boolean>,
  'setFeeTo' : ActorMethod<[Principal], boolean>,
  'setOwner' : ActorMethod<[Principal], boolean>,
  'setPair' : ActorMethod<[Principal, Principal], TxReceipt>,
  'setPairConfig' : ActorMethod<
    [string, string, bigint, bigint, bigint],
    boolean
  >,
  'setToken' : ActorMethod<[Principal], boolean>,
  'swap' : ActorMethod<[Principal, Principal, bigint, bigint], TxReceipt>,
  'withdraw' : ActorMethod<[Principal, bigint], TxReceipt>,
}
export interface CapSettings {
  'CapRootBucketId' : [] | [string],
  'CapId' : string,
}
export interface PairInfoExt {
  'k' : bigint,
  'l' : bigint,
  'id' : string,
  'creator' : Principal,
  'bReserve' : bigint,
  'feeRate' : bigint,
  'totalSupply' : bigint,
  'qReserve' : bigint,
  'pLast' : bigint,
  'qToken' : string,
  'bToken' : string,
  'lpToken' : string,
}
export interface TokenAnalyticsInfo {
  'fee' : bigint,
  'decimals' : number,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
}
export interface TokenInfoExt {
  'id' : string,
  'fee' : bigint,
  'decimals' : number,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
}
export type TxReceipt = { 'ok' : bigint } |
  { 'err' : string };
export interface UserInfo {
  'lpBalances' : Array<[string, bigint]>,
  'balances' : Array<[string, bigint]>,
}
export interface _SERVICE extends BrownFi {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
