import { Citizen } from "../src/citizens";

export const Citizens = (props: { citizens: Citizen[] }) => (
  <div id="citizens">
    <h2>Citizens</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Surname</th>
          <th>ID</th>
          <th>Height</th>
          <th>Weight</th>
          <th>Species</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.citizens.map((citizen) => (
          <tr>
            <td>{citizen.name}</td>
            <td>{citizen.surname}</td>
            <td>{citizen.id}</td>
            <td>{citizen.height} cm</td>
            <td>{citizen.weight} kg</td>
            <td>{citizen.species.toString()}</td>
            <td>{citizen.status.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
