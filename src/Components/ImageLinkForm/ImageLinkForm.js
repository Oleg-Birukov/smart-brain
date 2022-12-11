import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
	return (
		<div>
			<p className="f3">
				{`This Magic Brain will detect faces on you image. Give it a try.`}
			</p>
			<div className="flex justify-center pa2">
				<div className="form flex items-center flex-column pa4 br3 shadow-5 flex-row-ns">
					<input
						type="text"
						onChange={onInputChange}
						name=""
						id=""
						className="f4 pa2 w-100 w-70-ns center"
					/>
					<button onClick={onButtonSubmit} className="w-30-ns ml2-ns mt0-ns w-60 mt2 grow f4 link ph3 pv2 dib white bg-light-purple ">
						Detect
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImageLinkForm;
