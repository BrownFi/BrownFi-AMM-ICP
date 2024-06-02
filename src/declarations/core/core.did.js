export const idlFactory = ({ IDL }) => {
  const TxReceipt = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const CapSettings = IDL.Record({
    'CapRootBucketId' : IDL.Opt(IDL.Text),
    'CapId' : IDL.Text,
  });
  const PairInfoExt = IDL.Record({
    'k' : IDL.Nat,
    'l' : IDL.Nat,
    'id' : IDL.Text,
    'creator' : IDL.Principal,
    'bReserve' : IDL.Nat,
    'feeRate' : IDL.Nat,
    'totalSupply' : IDL.Nat,
    'qReserve' : IDL.Nat,
    'pLast' : IDL.Nat,
    'qToken' : IDL.Text,
    'bToken' : IDL.Text,
    'lpToken' : IDL.Text,
  });
  const TokenInfoExt = IDL.Record({
    'id' : IDL.Text,
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const TokenAnalyticsInfo = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const UserInfo = IDL.Record({
    'lpBalances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    'balances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
  });
  const SwapUpdate = IDL.Record({
    'dy' : IDL.Nat,
    'p1' : IDL.Nat,
    'x1' : IDL.Nat,
    'y1' : IDL.Nat,
    'fee' : IDL.Nat,
  });
  const QuoteTxReceipt = IDL.Variant({ 'ok' : SwapUpdate, 'err' : IDL.Text });
  const BrownFi = IDL.Service({
    'addLiquidity' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat, IDL.Nat, IDL.Int],
        [TxReceipt],
        [],
      ),
    'balanceOf' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], []),
    'deposit' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'depositTo' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
    'getAmountIn' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
    'getCapSetting' : IDL.Func([], [CapSettings], []),
    'getDelegatee' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getPair' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Opt(PairInfoExt)],
        ['query'],
      ),
    'getPairList' : IDL.Func([], [IDL.Vec(PairInfoExt)], []),
    'getPairListByCreator' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(PairInfoExt)],
        [],
      ),
    'getTokenList' : IDL.Func([], [IDL.Vec(TokenInfoExt)], []),
    'getTokenMetadata' : IDL.Func([IDL.Text], [TokenAnalyticsInfo], ['query']),
    'getUserInfo' : IDL.Func([IDL.Principal], [UserInfo], ['query']),
    'quote' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [QuoteTxReceipt],
        [],
      ),
    'setCapId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setDelegation' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setPair' : IDL.Func([IDL.Principal, IDL.Principal], [TxReceipt], []),
    'setPairConfig' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'setToken' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'swap' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat, IDL.Int],
        [TxReceipt],
        [],
      ),
    'withdraw' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
  });
  return BrownFi;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal];
};
