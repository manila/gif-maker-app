import {createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import fs from 'fs';

function App() {
	const [file, setFile] = useState();
	const [fileArrayBuffer, setFileArrayBuffer] = useState();

	useEffect(() => {

		if (file) {
		const ffmpeg = createFFmpeg({ 
			corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',	
			log: true 
		});

		(async () => {
			await ffmpeg.load();
			ffmpeg.FS('writeFile', 'test.avi', await fetchFile(file));
			await ffmpeg.run('-i', 'test.avi', 'test.mp4');
			await fs.promises.writeFile('./test.mp4', ffmpeg.FS('readfile', 'test.mp4'));
			process.exit(0);
		})();
			console.log("Hello");
		}
		
		
	}, [file])

	const fileSelected = (event) => {
		setFile(event.target.files[0]);
	}

	return (
		<div className="content">
			<Header/>
			<UploadArea inputEventHandler={ fileSelected } />
			<PreviewArea/>
	 		<Controls/>
	  		<Footer/>
		</div>
	);
}

const Header = () => {
	return (
		<>
			<header>
				<h1>smaller.pics</h1>
			</header>
		</>
	)
}

const UploadArea = (props) => {
	return (
		<>
			<label className="upload-area">
				<input type="file" name="upload" accept="video/*" onInput={ props.inputEventHandler }/>
			</label>
		</>
	)
}

const PreviewArea = () => {
	return (
		<></>
	)
}

const Controls = () => {
	return (
		<>
			<form>
				<button className="download-button">DOWNLOAD</button>
			</form>
		</>
	)
}

const Footer = () => {
	return (
		<>
			<footer>{ "made with 💜 by manila" }</footer>
		</>
	)
}

export default App;
