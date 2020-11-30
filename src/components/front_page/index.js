import React, { useEffect, useState } from "react";
import "./styles.scss";
import configData from "../../config.json";

import Chart from "../chart";
import TrackerCard from "../tracker_card";
import GradeCorrelationChart from "../grade_correlation_chart";
import LargestEMA from "../largest_ema";

// component for front page of site
const FrontPage = (props, ref) => {
  // data states
  const [spyData, setSpyData] = useState(); // spy data graph
  const [trackers, setTrackers] = useState(); // list of trackers

  // is busy states
  const [isSpyBusy, setIsSpyBusy] = useState(true);
  const [isBusyTrackers, setIsBusyTrackers] = useState(true);

  // fetch call functions
  const fetchTrackers = async () => {
    fetch(configData.ENDPOINT + "/get_trackers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setTrackers(data.tracked);
        setIsBusyTrackers(false);
      });
  };
  const fetchSpyData = async () => {
    fetch(configData.ENDPOINT + "/get_data/spy", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setSpyData(data);
        setIsSpyBusy(false);
      });
  };

  useEffect(() => {
    fetchSpyData();
    fetchTrackers();
  }, []);

  return (
    <div className="front-page" ref={ref}>
      {props.enabled ? "" : ""}
      <LargestEMA />
      <GradeCorrelationChart />
      {isSpyBusy ? (
        <div className="front-page-loading">Loading...</div>
      ) : (
        <Chart prices={spyData.prices} />
      )}
      <div className="front-page-tracked-label">Trackers</div>
      <div className="front-page-tracked">
        {isBusyTrackers ? (
          <div className="front-page-loading">Loading...</div>
        ) : (
          !isBusyTrackers &&
          trackers.map((e) => <TrackerCard key={e.ticker} {...e} />)
        )}
      </div>
    </div>
  );
};

export default React.forwardRef(FrontPage);
