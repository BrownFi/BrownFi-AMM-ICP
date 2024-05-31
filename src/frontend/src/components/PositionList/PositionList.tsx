import { PositionDetails } from "../../model/pools";
import Position from "./Position";

interface PositionListProps {
  positions: PositionDetails[];
}

export default function PositionList({ positions } : PositionListProps) {
  return (
    <div
      style={{
        height: "388px",
        overflow: "auto",
        scrollbarColor: "#1D1C21 #323038",
        scrollbarWidth: "thin",
        scrollbarGutter: "stable both-edges",
      }}
    >
      {positions.length != 0
        ? positions.map((position) => (
          <Position position={position} key={position.id} />
        ))
        : null}
    </div>
  );
}
