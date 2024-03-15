import { useInternetIdentity } from "ic-use-internet-identity";
import styled, { css } from "styled-components";
import { ButtonSecondary } from "./Button";
import ConnectWallet from "/images/connect-wallet.png";

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`;

const Web3StatusConnect = styled(Web3StatusGeneric) <{ faded?: boolean, pending?: boolean }>`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.text1};
  font-weight: 500;

  a {
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
  }

  ${({ faded }) => faded && css``}
`;

const Text = styled.p`
  font-family: Montserrat
  flex: 1 1 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.5rem;
  font-size: 16px;
  width: fit-content;
  font-weight: 700;
  color: ${({ theme }) => theme.text1};
`;

export default function Login() {
  const { isLoggingIn, login, clear, identity } = useInternetIdentity();

  function handleClick() {
    if (!identity) login();
    else clear();
  }

  return (
    <Web3StatusConnect
      id="connect-wallet"
      faded={!identity}
      onClick={handleClick}
      pending={isLoggingIn}
    >
      <img src={ConnectWallet} />
      <Text>{identity ? identity?.getPrincipal().toString() : "Connect Wallet"}</Text>
    </Web3StatusConnect>
  );

}
