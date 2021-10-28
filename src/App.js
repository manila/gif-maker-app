import {createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';
import { useState, useEffect } from 'react';
import fs from 'fs';

function App() {
	const [ thumbnailSrc, setThumbnailSrc ] = useState('');
	const [ fileSrc, setFileSrc ] = useState('');
	const [ ffmpegOutput, setFfmpegOutput ] = useState('');

	const fileSelected = async (event) => {
		const file = event.target.files[0];

		if (file) {
			const ffmpeg = createFFmpeg({ 
				corePath: 'ffmpeg-core.js',	
				log: true 
			});

			ffmpeg.setLogger(({ type, message }) => {
				console.log(type, message);
				setFfmpegOutput(message);
			});

			await ffmpeg.load();

			ffmpeg.FS('writeFile', 'input', await fetchFile(file));

			await ffmpeg.run(
				'-i', 
				'input', 
				'-ss','0.01', '-vframes' ,'1', '-f', 'image2', 
				'thumbnail.jpg'
			);

			const thumbnail = ffmpeg.FS('readFile', 'thumbnail.jpg');

			setThumbnailSrc(URL.createObjectURL(
				new Blob([thumbnail.buffer], { type: 'image/jpg' })
			));

			await ffmpeg.run('-i', 'input', '-f', 'gif','output.gif');

			setFfmpegOutput("ffmpeg exited")

			const data = ffmpeg.FS('readFile', 'output.gif');
		
			setFfmpegOutput("Done.")

			const dataURL = URL.createObjectURL(
				new Blob([data.buffer], { type: 'image/gif' })
			);

			setFileSrc(dataURL);
		}
	}

	return (
		<div className="content">
			<Header/>
			{ !thumbnailSrc && <UploadArea inputEventHandler={ fileSelected } /> }
			<PreviewArea thumbnailSrc={ thumbnailSrc } gifSrc={ fileSrc } />
			<RawOutput text={ ffmpegOutput } />
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

const RawOutput = (props) => {
	return (
		<>
			<pre>{ props.text || 'ffmpeg not loaded' }</pre>
		</>
	);
}

const PreviewArea = (props) => {
	const { gifSrc, thumbnailSrc } = props;

	return (
		<div className="preview">
			{ !gifSrc && thumbnailSrc && <img src={ thumbnailSrc } />}
			{ gifSrc && <img src={ gifSrc } />}
		</div>
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
