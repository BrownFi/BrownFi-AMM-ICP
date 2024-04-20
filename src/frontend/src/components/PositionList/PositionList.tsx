import { RowBetween } from "../Row";
import Position from "./Position";

export default function PositionList({ positions }) {
  return (
    <div
      style={{
        height: "388px",
        overflow: "auto",
        scrollbarColor: "#1D1C21 #323038",
        scrollbarWidth: "thin",
        scrollbarGutter: "stable both-edges",
        cursor: "pointer",
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
