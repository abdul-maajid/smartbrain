import { Component } from "react";
import Signin from "./components/Signin/Signin";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Clarifai from "clarifai";
import Rank from "./components/Rank/Rank";
import "./App.css";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Register from "./components/Register/Register";

const particlesOptions = {
  particles: {
    number: {
      value: 100,
    },
    size: {
      value: 3,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
    },
  },
};

const app = new Clarifai.App({
  apiKey: "9bf61b51b92d4425a2c6aacf9e33a37c",
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedin: false,
    };
  }

  calculateFaceLocation = (data) => {
    let boxes = [];
    // const clarifaiFace =
    //   data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const height = Number(image.height);
    const width = Number(image.width);
    data.outputs[0].data.regions.map((data) => {
      let boundry = data.region_info.bounding_box;
      boxes.push({
        leftCol: boundry.left_col * width,
        topRow: boundry.top_row * height,
        rightCol: width - boundry.right_col * width,
        bottomRow: height - boundry.bottom_row * height,
      });
      return boundry;
    });
    return boxes;
  };

  displayBox = (boxes) => {
    this.setState({
      box: boxes,
    });
  };

  onInputChange = (ev) => {
    this.setState({
      input: ev.target.value,
    });
  };

  onRouteChange = (route) => {
    if (route === "signout")
      this.setState({
        isSignedin: false,
      });
    else if (route === "home")
      this.setState({
        isSignedin: true,
      });
    this.setState({
      route: route,
    });
  };

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input,
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => this.displayBox(this.calculateFaceLocation(response)))
      .catch((err) => console.log(err));
  };

  render() {
    const { isSignedin, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedin={isSignedin}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={box} imageUrl={imageUrl} />
          </div>
        ) : route === "register" ? (
          <Register onRouteChange={this.onRouteChange} />
        ) : (
          <Signin onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
