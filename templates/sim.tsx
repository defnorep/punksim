import { CitizensCensus, CitizensDetail } from "./citizens";
import { State } from "../src/state";
import { deriveCensus } from "../src/citizens";
import { Time } from "./global";

export const Sim = (props: { state: State }) => (
  <div id="sim">
    <Time time={props.state.worldTimeState.time} />
    <CitizensCensus census={deriveCensus(props.state.getCitizens())} />
    <CitizensDetail citizens={props.state.getCitizens()} />
  </div>
);
