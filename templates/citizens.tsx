import { State } from "../src/sim";

export const Citizens = (props: { state: State }) => (
  <div id="citizens">
    <h2>Citizens</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age (Days)</th>
          <th>Alive</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(props.state.citizens.values()).map((citizen) => (
          <tr>
            <td>{citizen.name}</td>
            <td>{citizen.ageDays}</td>
            <td>{citizen.alive ? 'Yes' : 'No' }</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);