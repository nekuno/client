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
		condensed: PropTypes.bool,
		background: PropTypes.string,
		// Injected by @translate:
		strings: PropTypes.object
	};

	render() {
		const { matching, similarity, condensed, strings } = this.props;

		const className = condensed
			? styles.matchingBarsCondensed
			: styles.matchingBars;
		return (
			<div className={className}>
				<div className={styles.progressBarTitle}>
					{strings.compatible}&nbsp;
				</div>
				<div className={styles.progressBar}>
					<ProgressBar
						percentage={
							matching
						} /*size={'small'} strokeColor={'#756EE5'} background={background}*/
					/>
				</div>
				<div className={styles.progressBarTitle}>
					{strings.similar}&nbsp;
				</div>
				<div className={styles.progressBar}>
					<ProgressBar
						percentage={
							similarity
						} /*size={'small'} strokeColor={'#756EE5'} background={background}*/
					/>
				</div>
			</div>
		);
	}
}

MatchingBars.defaultProps = {
	strings: {
		compatible: "Compatibilidad",
		similar: "Similaridad",
		condensed: false
	},
	matching: 0,
	similarity: 0,
	condensed: false,
	background: "white"
};

export default MatchingBars;
