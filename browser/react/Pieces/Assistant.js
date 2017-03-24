import React from 'react';

const Assistant = props => {
  const { playerNum } = props;
  return (
    <div className="assistant-container">
      { 
        playerNum === 0 ? <img src="images/player/redplayer-assistant.png" className="assistant-icon" /> :
        playerNum === 1 ? <img src="images/player/blueplayer-assistant.png" className="assistant-icon" /> :
        playerNum === 2 ? <img src="images/player/greenplayer-assistant.png" className="assistant-icon" /> :
        playerNum === 3 ? <img src="images/player/yellowplayer-assistant.png" className="assistant-icon" /> : null 
      }
    </div>
  );
}

export default Assistant;
