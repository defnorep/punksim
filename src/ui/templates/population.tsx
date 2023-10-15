import { LocationComponent } from "../../global";
import {
  CensusComponent,
  CivicIdentityComponent,
  EpochComponent,
  GenderComponent,
  ImplantsComponent,
  LifeformClassificationComponent,
  PhysicalComponent,
} from "../../population/population";

export const PopulationCensus = (props: { census?: CensusComponent }) => {
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
          <td>{props.census?.total}</td>
          <td>{props.census?.human}</td>
          <td>{props.census?.android}</td>
          <td>{props.census?.male}</td>
          <td>{props.census?.female}</td>
          <td>{props.census?.noGender}</td>
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

export const Population = (props: {
  citizens?: [
    CivicIdentityComponent,
    EpochComponent,
    PhysicalComponent,
    LifeformClassificationComponent,
    GenderComponent,
    LocationComponent,
    ImplantsComponent,
  ][];
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
        {props.citizens?.map(
          ([id, epoch, physical, lifeform, gender, location]) => (
            <tr>
              <td>{id.name}</td>
              <td>{id.surname}</td>
              <td>{id.civicId}</td>
              <td>{epoch.age}</td>
              <td>{gender.gender.toString()}</td>
              <td>{physical.dimensions[0]} cm</td>
              <td>{physical.mass} kg</td>
              <td>{lifeform.species.toString()}</td>
              <td>{id.status.toString()}</td>
              <td>{location.locationId}</td>
            </tr>
          ),
        )}
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
