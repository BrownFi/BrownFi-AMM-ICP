import styled, { css } from "styled-components";
import { ButtonSecondary } from "./Button";
import ConnectWallet from "/images/connect-wallet.png";
import { useAuth } from "@ic-reactor/react";

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 18px 24px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`;

const Web3StatusConnect = styled(Web3StatusGeneric)<{
  faded?: boolean;
  pending?: boolean;
}>`
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
  font-family: Montserrat;
  flex: 1 1 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.6rem;
  font-size: 16px;
  width: fit-content;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
`;

export default function Login() {
  const { authenticated, authenticating, login, logout, identity } = useAuth();

  function handleClick() {
    if (identity?.getPrincipal().isAnonymous()) login();
    else logout();
  }

  return (
    <Web3StatusConnect
      id="connect-wallet"
      faded={!authenticated}
      onClick={handleClick}
      pending={authenticating}
    >
      <img src={ConnectWallet} />
      <Text>
        {authenticated
          ? `${identity?.getPrincipal().toString().slice(0, 5)}...${identity
              ?.getPrincipal()
              .toString()
              .slice(-3)}`
          : "Connect Wallet"}
      </Text>
    </Web3StatusConnect>
  );
}
