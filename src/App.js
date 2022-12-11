import "./App.css";
import React, { Component } from "react";
// import Clarifai from "clarifai";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Rank from "./Components/Rank/Rank";
import ParticlesBg from "particles-bg";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";

const bg = {
	position: "fixed",
	zIndex: -1,
	top: 0,
	left: 0,
};

const initialState = {
	input: "",
	imageUrl: "",
	box: {},
	route: "signin",
	isSignedIn: false,
	user: {
		id: "",
		name: "",
		email: "",
		entries: 0,
		joined: "",
	},
};

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	onLoadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	calculatFaceLocation = (data) => {
		const clarifaiFace =
			data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById("inputimage");
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			topRow: clarifaiFace.top_row * height,
			bottomRow: height - clarifaiFace.bottom_row * height,
			leftCol: clarifaiFace.left_col * width,
			rightCol: width - clarifaiFace.right_col * width,
		};
	};

	displayFaceBox = (box) => {
		this.setState({ box: box });
	};

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });

		fetch("https://smart-brain-api-8yb6.onrender.com/imageurl", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				input: this.state.input,
			}),
		})
			.then((res) => {
				if (res.status !== 200) return {};
				return res.json();
			})
			.then((data) => {
				// console.log(data);
				fetch("https://smart-brain-api-8yb6.onrender.com/image", {
					method: "put",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: this.state.user.id.toString() }),
				})
					.then((response) => response.json())
					.then((count) => {
						this.setState(
							Object.assign(this.state.user, {
								entries: count,
							})
						);
					})
					.catch(console.log);
				if (data && data.outputs) this.displayFaceBox(this.calculatFaceLocation(data));
			})
			.catch((err) => console.log(err));
		// //////////////////////////////////////////////////////////////////////////////////////////
		// // In this section, we set the user authentication, app ID, model details, and the URL
		// // of the image we want as an input. Change these strings to run your own example.
		// /////////////////////////////////////////////////////////////////////////////////////////

		// const USER_ID = "sqpvde9mgoif";
		// // Your PAT (Personal Access Token) can be found in the portal under Authentification
		// const PAT = "b7772a8b8b5746ba9390cd178e36abe6";
		// const APP_ID = "my-first-application";
		// // Change these to whatever model and image URL you want to use
		// const MODEL_ID = "face-detection";
		// const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
		// const IMAGE_URL = this.state.input;

		// ///////////////////////////////////////////////////////////////////////////////////
		// // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
		// ///////////////////////////////////////////////////////////////////////////////////

		// const raw = JSON.stringify({
		// 	user_app_id: {
		// 		user_id: USER_ID,
		// 		app_id: APP_ID,
		// 	},
		// 	inputs: [
		// 		{
		// 			data: {
		// 				image: {
		// 					url: IMAGE_URL,
		// 				},
		// 			},
		// 		},
		// 	],
		// });

		// const requestOptions = {
		// 	method: "POST",
		// 	headers: {
		// 		Accept: "application/json",
		// 		Authorization: "Key " + PAT,
		// 	},
		// 	body: raw,
		// };

		// // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
		// // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
		// // this will default to the latest version_id

		// fetch(
		// 	"https://api.clarifai.com/v2/models/" +
		// 		MODEL_ID +
		// 		"/versions/" +
		// 		MODEL_VERSION_ID +
		// 		"/outputs",
		// 	requestOptions
		// )
		// 	.then((response) => response.json())
		// 	.then((result) => console.log(result.outputs[0].data.regions[0].region_info.bounding_box))
		// 	.catch((error) => console.log("error", error));
	};

	onRouteChange = (route) => {
		if (route === "home") {
			this.setState({ isSignedIn: true });
		} else if (route === "signout") {
			this.setState(initialState);
		}
		this.setState({ route: route });
	};

	render() {
		const { isSignedIn, box, imageUrl, route } = this.state;
		return (
			<div className="App">
				<ParticlesBg type="cobweb" bg={bg} color="#0095ff" num={240} />
				<Navigation
					onRouteChange={this.onRouteChange}
					isSignedIn={isSignedIn}
				/>
				{route === "home" ? (
					<div>
						{" "}
						<Logo />
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}
						/>
						<FaceRecognition box={box} imageUrl={imageUrl} />
					</div>
				) : route === "signin" || route === "signout" ? (
					<Signin
						onRouteChange={this.onRouteChange}
						onLoadUser={this.onLoadUser}
					/>
				) : (
					<Register
						onRouteChange={this.onRouteChange}
						onLoadUser={this.onLoadUser}
					/>
				)}
			</div>
		);
	}
}

export default App;
