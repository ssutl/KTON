import React from 'react';
import styles from '../styles/ErrorBoundary.module.scss';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
class ErrorBoundary extends React.Component<any, any> {
	constructor(props: any) {
		super(props);

		// Define a state variable to track whether is an error or not
		this.state = { hasError: false, error: '' };
	}
	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI

		return { hasError: true, error };
	}
	componentDidCatch(error: any, errorInfo: any) {
		// You can use your own error logging service here
		// console.log({ error, errorInfo });
	}
	render() {
		// Check if the error is thrown

		if (this.state.hasError) {
			// You can render any custom fallback UI

			return (
				<div className={styles.page}>
					<div>
						<SentimentVeryDissatisfiedIcon />
						<h2>Oops, there was an error whilst trying to load this page</h2>
						<button type="button" onClick={() => this.setState({ hasError: false })}>
							Try again?
						</button>

						<div>
							<h3>Here&rsquo;s the error message:</h3>
							<span>{JSON.stringify(this.state.error.message)}</span>
						</div>
					</div>
				</div>
			);
		}

		// Return children components in case of no error

		return this.props.children;
	}
}

export default ErrorBoundary;
