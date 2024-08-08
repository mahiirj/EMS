import React, { useState, useEffect } from "react";

const formatDate = (date) => {
  const options = { weekday: "long", day: "numeric", month: "long" };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
};

const RealTimeDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <p>
        <h1>{formatDate(currentDate)}</h1>
      </p>
    </div>
  );
};

export default RealTimeDate;
