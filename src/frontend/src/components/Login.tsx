import { useState } from "react";
import styled from "@emotion/styled";
import { css } from '@emotion/css';
import { ButtonLight, ButtonSecondary } from "./Button";
import ConnectWallet from "/images/connect-wallet.png";
import { useAuth } from "@ic-reactor/react";
import { ConfirmProvider, useConfirm } from "material-ui-confirm";

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

const Web3StatusConnect = styled(Web3StatusGeneric) <{
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

export interface LoginProps {
  asButton?: boolean;
}

function Login({ asButton }: LoginProps) {
  const { authenticated, authenticating, login, logout, identity } = useAuth();
  const confirm = useConfirm();

  function handleClick() {
    if (identity?.getPrincipal().isAnonymous()) login();
    else {
      confirm({
        title: "Logout",
        description: "Are you sure you want to logout?",
        allowClose: true,
      })
        .then(() => logout())
        .catch(() => { })
    }
  }

  if (asButton) {
    return (
      <div className='flex w-full justify-center'>
        <ButtonLight maxWidth={'436px'} onClick={() => {login()}}>
          <img src={ConnectWallet} /> &nbsp; {authenticated
            ? `${identity?.getPrincipal().toString().slice(0, 5)}...${identity
              ?.getPrincipal()
              .toString()
              .slice(-3)}`
            : "Connect Wallet"}
        </ButtonLight>
      </div>
    );
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

Login.defaultProps = {
  asButton: false,
};

export default function WrappedLogin(props: LoginProps) {
  return (
    <ConfirmProvider>
      <Login {...props} />
    </ConfirmProvider>
  );
}