export const Time = (props: { time: number }) => (
  <div id="time">{new Date(props.time).toUTCString()}</div>
);
