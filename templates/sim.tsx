import { CitizensCensus, CitizensDetail } from "./citizens";
import { State } from "../src/state";
import { Time } from "./global";

export const Sim = (props: { states: State[] }) => {
  const jsx = props.states.map((state) => {
    switch (state.kind) {
      case "worldtime":
        return <Time time={state.time.getTime()} />;
      case "citizens":
        return [
          <CitizensCensus census={state.census} />,
          <CitizensDetail citizens={state.citizens} />,
        ];
    }
  });
  return <div id="sim">{jsx}</div>;
};
