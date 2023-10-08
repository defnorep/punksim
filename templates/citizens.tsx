import { Census, Citizen } from "../src/system/citizens";
import { Location } from "../src/system/transport";

export const CitizensCensus = (props: { census?: Census }) => {
  const jsx = (
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
          <td>{props.census?.population.total}</td>
          <td>{props.census?.population.human}</td>
          <td>{props.census?.population.android}</td>
          <td>{props.census?.population.male}</td>
          <td>{props.census?.population.female}</td>
          <td>{props.census?.population.noGender}</td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div id="citizens-census">
      <h2>Census</h2>
      {props.census ? jsx : "No Socket"}
    </div>
  );
};

export const CitizensDetail = (props: {
  citizens?: { citizen: Citizen; location: Location }[];
}) => {
  const jsx = (
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
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {props.citizens?.map((citizen) => (
          <tr>
            <td>{citizen.citizen.name}</td>
            <td>{citizen.citizen.surname}</td>
            <td>{citizen.citizen.id}</td>
            <td>{citizen.citizen.age}</td>
            <td>{citizen.citizen.gender.toString()}</td>
            <td>{citizen.citizen.height} cm</td>
            <td>{citizen.citizen.weight} kg</td>
            <td>{citizen.citizen.species.toString()}</td>
            <td>{citizen.citizen.status.toString()}</td>
            <td>{citizen.location.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div id="citizens-detail">
      <h2>Individuals</h2>
      {props.citizens ? jsx : "No Socket"}
    </div>
  );
};
