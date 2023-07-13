import { React, useState, useEffect } from "react";
import "./App.css";
import "./Button.css";
import { VideoComponent } from "./component/video";
import { PictureComponent } from "./component/picture";

function App() {
  const [isView, setIsView] = useState(false);

  return (
    <div className="App">
      <div id="picture">
        <div className="block1">
        <h2 class="heading07" data-en="Find a Celebrity 1 ??"></h2>
          <div id="videoDiv">
            <video id="video" autoPlay muted playsInline></video>
          </div>
          <div>
            <canvas id="canvas"></canvas>
          </div>
          <VideoComponent setIsView={setIsView} />
        </div>
        {isView && (
          <div className="block2  change-time05 box fadeUp">
            <PictureComponent />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
