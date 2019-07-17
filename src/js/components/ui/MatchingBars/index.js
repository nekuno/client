import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "./MatchingBars.scss";
import ProgressBar from "../ProgressBar";
import translate from "../../../i18n/Translate";

@translate("MatchingBars")
class MatchingBars extends Component {
	static propTypes = {
		matching: PropTypes.number,
		similarity: PropTypes.number,
		background: PropTypes.string,
		// Injected by @translate:
		strings: PropTypes.object
	};

	render() {
		const { matching, similarity, strings } = this.props;

		return (
			<div className={styles.matchingBars}>
				<div className={styles.progressBarTitle}>
					{strings.compatible}&nbsp;
				</div>
				<div className={styles.progress}>
					<ProgressBar percentage={matching} /*size={'small'} strokeColor={'#756EE5'} background={background}*/ />
					<div className={styles.matchingPercentage}>{Math.round(matching) + ' %'}</div>
				</div>
				<div className={styles.progressBarTitle}>
					{strings.similar}&nbsp;
				</div>
				<div className={styles.progress}>
					<ProgressBar percentage={similarity} /*size={'small'} strokeColor={'#756EE5'} background={background}*/ />
					<div className={styles.matchingPercentage}>{Math.round(similarity) + ' %'}</div>
				</div>
			</div>
		);
	}
}

MatchingBars.defaultProps = {
	strings: {
		compatible: "Compatibilidad",
		similar: "Similaridad",
	},
	matching: 0,
	similarity: 0,
	condensed: false,
	background: "white"
};

export default MatchingBars;
