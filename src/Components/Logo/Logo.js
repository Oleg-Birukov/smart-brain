import React from "react";
import Tilt from "react-parallax-tilt";
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
	return (
		<div className="ma4 mt0" style={{ width: "100px" }}>
			<Tilt perspective={500} className="tilt-logo">
				<div
					className="logo"
					style={{
						height: "100px",
						width: "100px",
					}}>
					<img src={brain} alt='logo' />
				</div>
			</Tilt>
		</div>
	);
};

export default Logo;
