import useTheme from '../../hooks/useTheme';
import { RowBetween } from "../Row";
import { GoDotFill } from "react-icons/go";
import { TYPE as Text } from "../../theme";
import { PositionDetails } from "../../model/pools";

interface PositionProps {
  position: PositionDetails
}

export default function Position({ position }: PositionProps) {
  const theme = useTheme();
  return (
    <div
      className="py-3 px-6 flex flex-col gap-3 cursor-pointer"
    >
      <RowBetween>
        <Text.body
          className="flex gap-2"
          color={theme.white}
          fontSize={16}
          fontWeight={700}
        >
          {position.tokenPay}/{position.tokenReceive}
          <div className="h-6 flex justify-center items-center bg-[#314243] px-2">
            <Text.body color={theme.green2} fontSize={14} fontWeight={500}>
              --
            </Text.body>
          </div>
        </Text.body>
        <div className="h-6 flex justify-center items-center bg-[#314243] px-2 gap-1" style={
          position.isActive ? { backgroundColor: theme.green2 } : { backgroundColor: theme.red2 }
        }>
          <GoDotFill color={theme.green2} size={14} />
          <Text.body
            className="flex gap-1"
            fontSize={14}
            fontWeight={500}
          >
            {position?.isActive ? "Active" : "Closed"}
          </Text.body>
        </div>
      </RowBetween>

      <div className="h-6 flex items-center gap-10">
        <Text.body
          className="flex gap-2"
          color={theme.white}
          fontSize={14}
          fontWeight={500}
        >
          Parameter: --
        </Text.body>
        <Text.body color={theme.white} fontSize={14} fontWeight={500}>
          Current LP price: --
        </Text.body>
      </div>

      <div className="w-full h-[1px] bg-[#4c4a4f]" />
    </div>
  );
}
