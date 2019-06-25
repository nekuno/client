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
		this.submit = this.submit.bind(this)

		this.state = {
			current: 0
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
		this.context.router.push("/availability-edit");
	}

	render() {
		const {
			recommendations,
			strings,
			isLoading
		} = this.props;
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
				<div className={styles.addProposal} onClick={this.submit}></div>
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
