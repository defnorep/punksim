import { Census, Citizen, age } from "../src/system/citizens";

export const CitizensCensus = (props: { census: Census }) => (
  <div id="citizens-census">
    <h2>Census</h2>
    <table>
      <thead>
        <caption style="text-align: left;">Population</caption>
        <tr>
          <th>Total</th>
          <th>Human</th>
          <th>Android</th>
          <th>Male</th>
          <th>Female</th>
          <th>No Gender</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.census.population.total}</td>
          <td>{props.census.population.human}</td>
          <td>{props.census.population.android}</td>
          <td>{props.census.population.male}</td>
          <td>{props.census.population.female}</td>
          <td>{props.census.population.noGender}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const CitizensDetail = (props: { citizens: Citizen[] }) => (
  <div id="citizens-detail">
    <h2>Individuals</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Surname</th>
          <th>ID</th>
          <th>Age</th>
          <th>Gender</th>
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
            <td>{age(citizen.birthdate)}</td>
            <td>{citizen.gender.toString()}</td>
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
