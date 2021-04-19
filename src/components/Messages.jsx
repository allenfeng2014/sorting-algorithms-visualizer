import React from "react";
import "../css/Messages.css";

function Messages({ speed, sortingAlgo, numsTotal }) {
  return (
    <div className="messages-container">
      <span className="message-block" id="message-refresh">
        Generate new numbers
      </span>
      <span className="message-block" id="message-settings">
        Animation settings:
        <b>{`${speed} ms/frame, ${numsTotal} nums`}</b>
      </span>
      <span className="message-block" id="message-algo">
        {sortingAlgo ? (
          <span>
            Algorithm: <b>{sortingAlgo}</b>
          </span>
        ) : (
          <b>Pick an algorithm !!!!!</b>
        )}
      </span>
      <span className="message-block" id="message-start">
        Start
      </span>
    </div>
  );
}

export default Messages;
