import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './OtherUserBottomNavBar.scss';
import RoundedIcon from "../RoundedIcon/RoundedIcon";
import translate from "../../../i18n/Translate";

@translate('OtherUserBottomNavBar')
export default class OtherUserBottomNavBar extends Component {

    static propTypes = {
        userSlug       : PropTypes.string,
        current        : PropTypes.oneOf(['about-me', 'proposals', 'messages', 'answers', 'interests']),
        notifications  : PropTypes.number,
        onClickHandler : PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickAboutMe = this.handleClickAboutMe.bind(this);
        this.handleClickProposals = this.handleClickProposals.bind(this);
        this.handleClickAnswers = this.handleClickAnswers.bind(this);
        this.handleClickInterests = this.handleClickInterests.bind(this);

        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.addProfessionalProposal = this.addProfessionalProposal.bind(this);
        this.addLeisurePlan = this.addLeisurePlan.bind(this);
        this.addExperienceProposal = this.addExperienceProposal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);

        this.state = {
            addingProposal: false
        };
    }

    handleClickAboutMe() {
        const {userSlug, current} = this.props;

        if (current !== 'about-me') {
            this.context.router.push('/p/' + userSlug + '/about-me');
        }
    }

    handleClickProposals() {
        const {userSlug, current} = this.props;

        if (current !== 'proposals') {
            this.context.router.push('/p/' + userSlug + '/proposals');
        }
    }

    handleClickAnswers() {
        const {userSlug, current} = this.props;

        if (current !== 'answers') {
            this.context.router.push('/p/' + userSlug + '/answers');
        }
    }

    handleClickInterests() {
        const {userSlug, current} = this.props;

        if (current !== 'interests') {
            this.context.router.push('/p/' + userSlug + '/interests');
        }
    }

    handleClickAdd() {
        this.setState({addingProposal: true});
    }

    addProfessionalProposal() {
        this.context.router.push('/proposals-project-introduction');
    }

    addLeisurePlan() {
        this.context.router.push('/proposals-leisure-introduction');
    }

    addExperienceProposal() {
        this.context.router.push('/proposals-experience-introduction');
    }

    closeAddModal() {
        this.setState({addingProposal: false});
    }

    polarToCartesian = function(radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: radius + (radius * Math.cos(angleInRadians)),
            y: radius + (radius * Math.sin(angleInRadians))
        };
    };

    describeArc = function(radius, strokeWidth, startAngle, endAngle) {
        endAngle = endAngle === 360 ? 359.9 : endAngle;
        let start = this.polarToCartesian(radius, endAngle);
        let end = this.polarToCartesian(radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x + strokeWidth, start.y + strokeWidth,
            "A", radius, radius, 0, largeArcFlag, 0, end.x + strokeWidth, end.y + strokeWidth
        ].join(" ");
    };

    iconXValue = function(radius, endAngle) {
        const end = this.polarToCartesian(radius, endAngle);

        return end.x + 40;
    };

    iconYValue = function(radius, endAngle) {
        const end = this.polarToCartesian(radius, endAngle);

        return end.y + 35;
    };

    renderIcon = function(icon, radius, degrees, background, onClick) {
        return (
            <foreignObject key={icon} x={this.iconXValue(radius, degrees)} y={this.iconYValue(radius, degrees)} width="60" height="60">
                <RoundedIcon icon={icon} size={'medium'} background={background} fontSize={'25px'} onClickHandler={onClick}/>
            </foreignObject>
        );
    };

    renderIconText = function(text, radius, degrees) {
        return (
            <foreignObject x={this.iconXValue(radius, degrees)} y={this.iconYValue(radius, degrees)} width="60" height="60">
                <div className={styles.iconText + ' small'}>{text}</div>
            </foreignObject>
        );
    };

    render() {
        const {current, notifications, strings} = this.props;
        const {addingProposal} = this.state;

        return (
            <div className={styles.otherUserBottomNavbar}>
                <div className={current === 'about-me' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickAboutMe}>
                    <div className={styles.icon + ' icon icon-user'}/>
                    <div className={styles.iconText + ' small'}>{strings.aboutMe}</div>
                </div>
                <div className={current === 'proposals' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickProposals}>
                    <div className={styles.icon + ' icon icon-copy'}/>
                    <div className={styles.iconText + ' small'}>{strings.proposals}</div>
                </div>
                <div className={styles.iconWrapper + ' ' + styles.middleIconWrapper} onClick={this.handleClickAdd}>
                    <div className={styles.middleIconCircle}>
                        <div className={styles.icon + ' icon icon-edit'}/>
                    </div>
                </div>
                <div className={current === 'answers' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickAnswers}>
                    <div className={styles.icon + ' icon icon-check-square'}/>
                    <div className={styles.iconText + ' small'}>{strings.answers}</div>
                </div>
                <div className={current === 'interests' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickInterests}>
                    <div className={styles.icon + ' icon icon-bookmark'}/>
                    {notifications ?
                        <div className={styles.notificationsWrapper}>
                            <div className={styles.notifications}>
                                {notifications > 99 ? 99 : notifications}
                            </div>
                        </div>
                        : null
                    }
                    <div className={styles.iconText + ' small'}>{strings.interests}</div>
                </div>
                {/*{addingProposal ?*/}
                    {/*<div className={styles.addProposalWrapper} onClick={this.closeAddModal}>*/}
                        {/*<div className={styles.addProposalAbsoluteWrapper}>*/}
                            {/*<div className={styles.addProposal}>*/}
                                {/*<svg width={70 * 2 + 70 * 2} height={70 * 2 + 70 * 2} xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*<g>*/}
                                        {/*<path d={this.describeArc(70, 70, 235, 270 + 215)}*/}
                                              {/*fill={'none'} strokeWidth={70} stroke={'white'} strokeLinecap="round"*/}
                                        {/*/>*/}
                                        {/*{this.renderIconText(strings.proposal, 70, 270)}*/}
                                        {/*{this.renderIcon('paperclip', 70, 270, '#63CAFF', this.addProfessionalProposal)}*/}
                                        {/*{this.renderIconText(strings.leisure, 70, 0)}*/}
                                        {/*{this.renderIcon('send', 70, 0, '#D380D3',  this.addLeisurePlan)}*/}
                                        {/*{this.renderIconText(strings.experience, 70, 90)}*/}
                                        {/*{this.renderIcon('compass', 70, 90, '#7BD47E',  this.addExperienceProposal)}*/}
                                    {/*</g>*/}
                                {/*</svg>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*: null*/}
                {/*}*/}
            </div>
        );
    }
}

OtherUserBottomNavBar.defaultProps = {
    strings: {
        aboutMe   : 'About me',
        proposals : 'Proposals',
        answers   : 'Answers',
        interests : 'Interests',
    }
};