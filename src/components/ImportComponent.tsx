import styles from '../styles/ImportComponent.module.scss';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import ImportButton from './ImportButton';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import ImportBooksApi from '@/api/Users/ImportBooks';

const socket = io(`${process.env.NEXT_PUBLIC_BACKENDURL}`);

const ImportComponent = () => {
	const [progress, setProgress] = useState<'Started' | 'None' | 'Complete'>('None');
	const [percentage, setPercentage] = useState<number>(2);
	const router = useRouter();
	const [username, setUsername] = useState<string>('');
	const [incomingFile, setIncomingFile] = useState<File | null>(null);

	console.log('username', username);

	useEffect(() => {
		setUsername(localStorage.getItem('username') as string);
	}, []);

	const updatePercentage = useCallback(
		(value: number) => {
			//In order to prevent the progress bar from going backwards, because of the way the socket works
			if (percentage < value) {
				setPercentage(value);
			}
		},
		[percentage],
	);

	//Connecting to the sockets to see the progress of the upload
	useEffect(() => {
		if (progress === 'Started') {
			socket.on('connect', () => {
				socket.on('upload-progress', (data) => {
					updatePercentage(Number(data));
				});
			});
		}
		return () => {
			socket.off('connect');
			socket.off('upload-progress');
			socket.disconnect();
		};
	}, []);

	socket.on('upload-progress', (data) => {
		updatePercentage(Number(data));
	});
	//UseEffect to see what the progress is
	useEffect(() => {
		if (progress === 'Complete' && setPercentage) {
			setTimeout(() => {
				//After two seconds of completed being shown pass user to home page
				router.push('Home');
				setPercentage(0);
			}, 1000);
		}
	}, [progress, router]);

	if (!username) return null;

	const uploadFile = async () => {
		var file = incomingFile;
		var textType = /text.*/;

		if (file) {
			//This is the upload process for the user's library, so we can parse server side
			const formData = new FormData(); // needed for uploading a file
			formData.append('clippingsFile', file); // adds the uploaded file under the name "clippingsFile" to the formData variable
			setProgress('Started');
			const status = await ImportBooksApi({ formData });
			setProgress(status);
		}
	};

	return (
		<div className={styles.importSect}>
			<div className={styles.importInfoSect}>
				<h2>
					{progress === 'None'
						? `Import your clippings to ${JSON.parse(username)}`
						: progress === 'Started'
						? `Importing Clippings`
						: `Upload Complete!`}
				</h2>
				<p>
					{progress === 'None'
						? `Locate "Clippings.txt"`
						: progress === 'Started'
						? `Uploading.... ${percentage}%`
						: `Happy reading!`}
				</p>
			</div>
			<div className={styles.buttonContainer}>
				<input
					type="file"
					id="input"
					className={styles.input}
					disabled={progress === 'Started' ? true : false}
					onChange={(event) => {
						if (event.target.files !== null) {
							if (
								event.target.files[0].type === 'text/plain' &&
								(event.target.files[0].name === 'My Clippings.txt' || event.target.files[0].name === 'clippings.txt')
							) {
								setIncomingFile(event.target.files[0]);
							} else {
								alert(`Only 'My Clippings' files can be uploaded`);
							}
						}
					}}
				></input>
				<label className={`${styles.button} ${progress === 'Started' ? styles.active : null}`} htmlFor="input">
					{incomingFile ? <p>{incomingFile.name}</p> : <p>+ Import to KTON</p>}
				</label>
				{incomingFile ? (
					<div
						className={`${styles.button} ${progress === 'Started' ? styles.active : null}`}
						onClick={() => (progress === 'Started' ? null : uploadFile())}
					>
						<p>Upload</p>
					</div>
				) : null}
			</div>
			{progress === 'Started' ? (
				<div className={styles.progressSect}>
					<div className={styles.progress_bar}>
						<div className={styles.progress_bar_fill} style={{ width: `${percentage}%` }}></div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ImportComponent;
