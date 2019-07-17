import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "./ProposalsPage.scss";
import translate from "../../../i18n/Translate";
import connectToStores from "../../../utils/connectToStores";
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import ProposalRecommendationList from "../../../components/ui/ProposalRecommendationList";
import TopNavBar from "../../../components/ui/TopNavBar";
import WorkersStore from "../../../stores/WorkersStore";
import ProposalStore from "../../../stores/ProposalStore";
import ProposalRecommendationsStore from "../../../stores/ProposalRecommendationsStore";
import "../../../../scss/pages/proposals.scss";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import LoadingSpinnerCSS from "../../../components/ui/LoadingSpinnerCSS";
import ToolBarMaster from '../../../components/ui/ToolBarMaster';

function requestData() {
	ProposalActionCreators.requestRecommendations();
}

function getState() {
	const networks = WorkersStore.getAll();
	const error = WorkersStore.getConnectError();
	const isLoading = WorkersStore.isLoading();

	const recommendations = ProposalRecommendationsStore.getAll();

	return {
		networks,
		error,
		isLoading,
		recommendations
	};
}

@AuthenticatedComponent
@translate("ProposalsPage")
@connectToStores(
	[WorkersStore, ProposalStore, ProposalRecommendationsStore],
	getState
)
class ProposalsPage extends Component {
	static propTypes = {
		// Injected by @AuthenticatedComponent
		user: PropTypes.object.isRequired,
		// Injected by @translate:
		strings: PropTypes.object,
		// Injected by @connectToStores:
		networks: PropTypes.array.isRequired,
		error: PropTypes.bool,
		isLoading: PropTypes.bool,
		recommendations: PropTypes.array.isRequired
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);

		ProposalActionCreators.cleanCreatingProposal();

		this.goToEditAvailability = this.goToEditAvailability.bind(this);
		this.submit = this.submit.bind(this);
		this.go = this.go.bind(this);

		this.state = {
			current: 0,
			hiddenButtons: true
		};
	}

	componentDidMount() {
		requestData(this.props);
	}

	goToEditAvailability() {
		this.context.router.push("/availability-edit");
	}

	renderEmptyMessage() {
		return <div className={styles.empty}>strings.empty</div>;
	}

	submit() {
		this.setState(state => ({ hiddenButtons: !state.hiddenButtons }));
	}

	go(route) {
		if (route === "project") {
			this.context.router.push("/proposals-project-introduction");
		} else if (route === "experience") {
			this.context.router.push("/proposals-experience-introduction");
		} else if (route === "leisure") {
			this.context.router.push("/proposals-leisure-introduction");
		}
	}

	render() {
		const {
			recommendations,
			strings,
			isLoading
		} = this.props;
		const { hiddenButtons } = this.state;
        const title = strings.discover;

		return (
			<div className={"views"}>
				<div className={styles.topNavBar}>
					<TopNavBar leftMenuIcon={true} centerText={title} />
				</div>
				<div className={styles.view}>
					{isLoading ? (
						<LoadingSpinnerCSS />
					) : (
						<ProposalRecommendationList
							recommendations={recommendations}
						/>
					)}
				</div>
				<div className={styles.buttons}>
					<div
						className={
							styles.project +
							" " +
							styles.btn +
							(hiddenButtons ? " " + styles.hidden : "")
						}
						onClick={() => this.go("project")}
					/>
					<div
						className={
							styles.experience +
							" " +
							styles.btn +
							(hiddenButtons ? " " + styles.hidden : "")
						}
						onClick={() => this.go("experience")}
					/>
					<div
						className={
							styles.leisure +
							" " +
							styles.btn +
							(hiddenButtons ? " " + styles.hidden : "")
						}
						onClick={() => this.go("leisure")}
					/>
					<div
						className={styles.addProposal}
						onClick={this.submit}
					>
						{hiddenButtons ? (
							<span className="icon-plus" />
						) : (
							<span className="icon-close" />
						)}
					</div>
				</div>
				<ToolBarMaster activeLink="proposals" />
			</div>
		);
	}
}

ProposalsPage.defaultProps = {
	strings: {
		discover: "Discover proposals"
	}
};

export default ProposalsPage;
