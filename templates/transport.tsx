import { Citizen } from "../src/system/citizens";
import { Travelling } from "../src/system/transport";

export const TravellersTable = (props: {
  travellers?: (Citizen & Travelling)[];
}) => {
  const jsx = (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Surname</th>
          <th>ID</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>Time To Destination</th>
        </tr>
      </thead>
      <tbody>
        {props.travellers?.map((traveller) => (
          <tr key={traveller.id}>
            <td>{traveller.name}</td>
            <td>{traveller.surname}</td>
            <td>{traveller.id}</td>
            <td>{traveller.originId}</td>
            <td>{traveller.destinationId}</td>
            <td>{traveller.timeRemaining / 1000} seconds</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div id="travellers-table">
      <h2>Travellers</h2>
      {props.travellers ? jsx : "No Socket"}
    </div>
  );
};
