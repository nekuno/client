import PropTypes from "prop-types";
import React, { Component } from "react";
import shouldPureComponentUpdate from "react-pure-render/function";
import TopLeftMenuLink from "./TopLeftMenuLink";
import TopLeftLink from "./TopLeftLink";
import TopRightLink from "./TopRightLink";
import RegularTopTitle from "./RegularTopTitle";

export default class TopNavBar extends Component {
	static propTypes = {
		leftMenuIcon: PropTypes.bool,
		leftIcon: PropTypes.string,
		leftText: PropTypes.string,
		centerText: PropTypes.string,
		centerTextSize: PropTypes.string,
		bottomText: PropTypes.string,
		rightIcon: PropTypes.string,
		secondRightIcon: PropTypes.string,
		rightText: PropTypes.string,
		rightIconsWithoutCircle: PropTypes.bool,
		onLeftLinkClickHandler: PropTypes.func,
		onCenterLinkClickHandler: PropTypes.func,
		onRightLinkClickHandler: PropTypes.func,
		onSecondRightLinkClickHandler: PropTypes.func,
		transparentBackground: PropTypes.bool
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {
			leftMenuIcon,
			leftIcon,
			leftText,
			centerText,
			centerTextSize,
			bottomText,
			rightIcon,
			secondRightIcon,
			rightText,
			rightIconsWithoutCircle,
			onLeftLinkClickHandler,
			onCenterLinkClickHandler,
			onRightLinkClickHandler,
			onSecondRightLinkClickHandler,
			transparentBackground
		} = this.props;
		const navBarClass = transparentBackground
			? "navbar-no-f7 transparent-background-navbar"
			: "navbar-no-f7";
		return (
			<div className={navBarClass}>
				{leftMenuIcon ? (
					<TopLeftMenuLink />
				) : (
					<TopLeftLink
						icon={leftIcon}
						wrapIcon={transparentBackground}
						text={leftText}
						onClickHandler={onLeftLinkClickHandler}
					/>
				)}
				<RegularTopTitle
					text={centerText}
					textSize={centerTextSize}
					bottomText={bottomText}
					onClickHandler={onCenterLinkClickHandler}
				/>
				<TopRightLink
					icon={rightIcon}
					secondIcon={secondRightIcon}
					text={rightText}
					iconsWithoutCircle={rightIconsWithoutCircle}
					onClickHandler={onRightLinkClickHandler}
					onSecondIconClickHandler={onSecondRightLinkClickHandler}
				/>
			</div>
		);
	}
}
