import React from "react";

function ReservationError(props) {
  return (
    
    <div className="alert alert-danger" role="alert">
      {props.err}
      {console.log(props.err, 'this is the props')}
    </div>
  );
}

export default ReservationError
