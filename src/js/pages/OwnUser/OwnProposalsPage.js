import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "./OwnProposalsPage.scss";
import translate from "../../i18n/Translate";
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
// import BottomNavBar from "../../components/ui/BottomNavBar";
import TopNavBar from "../../components/ui/TopNavBar";
import OwnProposalCard from "../../components/Proposal/OwnProposalCard/OwnProposalCard.js";
import WorkersStore from "../../stores/WorkersStore";

import CarouselContinuous from "../../components/ui/CarouselContinuous/CarouselContinuous";
import ProposalStore from "../../stores/ProposalStore";
import * as ProposalActionCreators from "../../actions/ProposalActionCreators";
import ProposalRecommendationsStore from "../../stores/ProposalRecommendationsStore";
import ProposalSummary from "../../components/Proposal/ProposalSummary/ProposalSummary";
import OwnProposalsOtherList from "../../components/Proposal/OwnProposalsOtherList/OwnProposalsOtherList";
import SelectInline from "../../components/ui/SelectInline";
import RouterStore from "../../stores/RouterStore";

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
	ProposalStore.setInitial();
	ProposalActionCreators.requestOwnProposals();

	const url = ProposalStore.getOwnProposalsLikedPaginationUrl();
	ProposalActionCreators.requestOwnProposalsLiked(url);
}

function getState(props) {
	const networks = WorkersStore.getAll();
	const error = WorkersStore.getConnectError();
	const isLoading = WorkersStore.isLoading();
	const ownProposals = ProposalStore.getAllOwn();

	const routes = RouterStore._routes;

	return {
		networks,
		error,
		isLoading,
		ownProposals,
		routes
	};
}

@AuthenticatedComponent
@translate("OwnProposalsPage")
@connectToStores(
	[WorkersStore, ProposalStore, ProposalRecommendationsStore],
	getState
)
export default class OwnProposalsPage extends Component {
	static propTypes = {
		// Injected by @AuthenticatedComponent
		user: PropTypes.object.isRequired,
		// Injected by @translate:
		strings: PropTypes.object,
		// Injected by @connectToStores:
		networks: PropTypes.array.isRequired,
		error: PropTypes.bool,
		isLoading: PropTypes.bool,
		ownProposals: PropTypes.array,
		likedProposals: PropTypes.array,
		routes: PropTypes.array
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);

		this.clickProposal = this.clickProposal.bind(this);
		this.selectOthers = this.selectOthers.bind(this);

		this.state = {
			others: "false"
		};
	}

	componentDidMount() {
		window.setTimeout(() => requestData(this.props), 0);
	}

	clickProposal(proposal) {
		const {user} = this.props;
		const proposalId = proposal.id;
		const userSlug = user.slug;
		const url = '/p/'+userSlug+'/proposal/'+proposalId;
		this.context.router.push(url);
	}

	getCards(proposals) {
		return proposals.map((proposal, index) => {
			return (
				<OwnProposalCard
					key={index}
					{...proposal}
					onClickHandler={() => this.clickProposal(proposal)}
				/>
			);
		});
	}

	selectOthers(others) {
		others = others[0];
		this.setState({ others: others });
	}

	goBack(routes) {
		const regex = /^(\/p\/.*)*(\/networks)*(\/friends)*(\/answers)*(\/interests)*$/;
		const next = routes.reverse().find(route => {
			return !regex.test(route);
		});

		this.context.router.push(next || "");
	}

	render() {
		const {
			user,
			ownProposals,
			notifications,
			strings,
			routes
		} = this.props;
		const { others } = this.state;
		let imgSrc =
			user && user.photo
				? user.photo.thumbnail.medium
				: "img/no-img/medium.jpg";
		const otherOptions = [
			{ id: "false", text: strings.published },
			{ id: "true", text: strings.others }
		];

		const carouselMargin = -15;

		const numberOfProposalsFeatured = 1;

		return (
			<div className={styles.ownProposalsPublishedView}>
				<TopNavBar
					textCenter={strings.myPlans}
					imageLeft={imgSrc}
					boxShadow={true}
					iconLeft="arrow-left"
					onLeftLinkClickHandler={() => this.goBack(routes)}
				/>
				<div className={styles.selectWrapper}>
					<div className={styles.selectInner}>
						<SelectInline
							options={otherOptions}
							multiple={false}
							onClickHandler={this.selectOthers}
							color={"purple"}
							defaultOption={others}
						/>
					</div>
				</div>

				{others === "true" ? (
					<OwnProposalsOtherList />
				) : (
					//TODO: Change to own component like OwnProposalOtherList
					<div className={styles.ownProposalsWrapper}>
						<div className={styles.preCardTitle}>
							{strings.popularProposals}
						</div>
						{ownProposals && ownProposals.length > 0 ? (
							<div className={styles.proposals}>
								<CarouselContinuous
									items={this.getCards(
										ownProposals.slice(
											0,
											numberOfProposalsFeatured
										)
									)}
									marginRight={carouselMargin}
								/>
							</div>
						) : null}
						{ownProposals.length > numberOfProposalsFeatured ? (
							<div>
								<div className={styles.preCardTitle}>
									{strings.otherPublishedProposals}
								</div>
								{ownProposals
									.slice(
										numberOfProposalsFeatured,
										ownProposals.length
									)
									.map((proposal, index) => (
										<ProposalSummary
											key={index}
											proposal={proposal}
											onClickHandler={this.clickProposal}
											hasCount={true}
										/>
									))}
							</div>
						) : null}
					</div>
				)}

				{/*<BottomNavBar current={"plans"} notifications={notifications} />*/}
			</div>
		);
	}
}

OwnProposalsPage.defaultProps = {
	strings: {
		myPlans: "My Plans",
		popularProposals: "Most popular proposals",
		otherPublished: "Other published proposals",
		matches: "Matches",
		otherPublishedProposals: "Other published proposals",
		published: "Published",
		others: "Others"
	}
};
