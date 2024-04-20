import { useTheme } from "styled-components";
import { TYPE } from "../../theme";
import { RowBetween } from "../Row";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export default function Position({ position }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/pool/${position.id}`);
  };

  return (
    <div
      className="py-3 px-6 flex flex-col gap-3 cursor-pointer"
      onClick={handleOnClick}
    >
      <RowBetween>
        <TYPE.body
          className="flex gap-2"
          color={theme.white}
          fontSize={16}
          fontWeight={700}
        >
          {position.tokenPay}/{position.tokenReceive}
          <div className="h-6 flex justify-center items-center bg-[#314243] px-2">
            <TYPE.body color={theme.green2} fontSize={14} fontWeight={500}>
              --
            </TYPE.body>
          </div>
        </TYPE.body>
        <div className="h-6 flex justify-center items-center bg-[#314243] px-2 gap-1">
          <GoDotFill color={theme.green2} size={14} />
          <TYPE.body
            className="flex gap-1"
            color={theme.green2}
            fontSize={14}
            fontWeight={500}
          >
            {position?.isActive ? "Active" : "Closed"}
          </TYPE.body>
        </div>
      </RowBetween>

      <div className="h-6 flex items-center gap-10">
        <TYPE.body
          className="flex gap-2"
          color={theme.white}
          fontSize={14}
          fontWeight={500}
        >
          Parameter: --
        </TYPE.body>
        <TYPE.body color={theme.white} fontSize={14} fontWeight={500}>
          Current LP price: --
        </TYPE.body>
      </div>

      <div className="w-full h-[1px] bg-[#4c4a4f]" />
    </div>
  );
}
