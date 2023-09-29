import { State } from "../src/system";
import { CitizensCensus, CitizensDetail } from "./citizens";
import { Time } from "./global";

export const Sim = (props: { states: State[] }) => {
  // Time will tell if this routing belongs in the template.
  // Maybe we just get rid of the Sim component and compose these directly.
  const jsx = props.states.map((state) => {
    switch (state.kind) {
      case "time":
        return <Time datetime={state.datetime} />;
      case "citizens":
        return [
          <CitizensCensus census={state.census} />,
          <CitizensDetail citizens={state.citizens} />,
        ];
    }
  });
  return <div id="sim">{jsx.length > 0 ? jsx : "Socket connecting..."}</div>;
};
