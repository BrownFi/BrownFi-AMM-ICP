import styled from "@emotion/styled";
import { ButtonLight } from "./Button";
import { AutoColumn } from "./Column";
import ConnectWallet from "/images/connect-wallet.png";
import { useAuth } from "@ic-reactor/react";

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`;

export default function CreatePair() {
  const { login, authenticated } = useAuth();

  return (
    <>
      ({authenticated} && (
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn
            gap="md"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <div className="flex w-full justify-center">
              <ButtonLight maxWidth={"436px"} onClick={() => login()}>
                <img src={ConnectWallet} /> &nbsp; Connect Wallet
              </ButtonLight>
            </div>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      ))
    </>
  );
}
