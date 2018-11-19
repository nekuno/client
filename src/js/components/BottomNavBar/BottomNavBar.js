import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import RoundedIcon from '../ui/RoundedIcon/RoundedIcon';
import styles from './BottomNavBar.scss';

@translate('BottomNavBar')
export default class BottomNavBar extends Component {

    static propTypes = {
        current        : PropTypes.oneOf(['proposals', 'persons', 'plans', 'messages']),
        notifications  : PropTypes.number,
        onClickHandler : PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickProposals = this.handleClickProposals.bind(this);
        this.handleClickPersons = this.handleClickPersons.bind(this);
        this.handleClickPlans = this.handleClickPlans.bind(this);
        this.handleClickMessages = this.handleClickMessages.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.addProfessionalProposal = this.addProfessionalProposal.bind(this);
        this.addLeisurePlan = this.addLeisurePlan.bind(this);
        this.addExperienceProposal = this.addExperienceProposal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);

        this.state = {
            addingProposal: false
        };
    }

    handleClickProposals() {
        const {current} = this.props;

        if (current !== 'proposals') {
            this.context.router.push('/proposals');
        }
    }

    handleClickPersons() {
        const {current} = this.props;

        if (current !== 'persons') {
            this.context.router.push('/persons');
        }
    }

    handleClickPlans() {
        const {current} = this.props;

        if (current !== 'plans') {
            this.context.router.push('/plans');
        }
    }

    handleClickMessages() {
        const {current} = this.props;

        if (current !== 'messages') {
            this.context.router.push('/conversations');
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
            <div className={styles.bottomNavBar}>
                <div className={current === 'proposals' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickProposals}>
                    <div className={styles.icon + ' icon icon-copy'}/>
                    <div className={styles.iconText + ' small'}>{strings.proposals}</div>
                </div>
                <div className={current === 'persons' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickPersons}>
                    <div className={styles.icon + ' icon icon-users'}/>
                    <div className={styles.iconText + ' small'}>{strings.persons}</div>
                </div>
                <div className={styles.iconWrapper + ' ' + styles.middleIconWrapper} onClick={this.handleClickAdd}>
                    <div className={styles.middleIconCircle}>
                        <div className={styles.icon + ' icon icon-plus'}/>
                    </div>
                </div>
                <div className={current === 'plans' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickPlans}>
                    <div className={styles.icon + ' icon icon-calendar'}/>
                    <div className={styles.iconText + ' small'}>{strings.plans}</div>
                </div>
                <div className={current === 'messages' ? styles.iconWrapper + ' ' + styles.current : styles.iconWrapper} onClick={this.handleClickMessages}>
                    <div className={styles.icon + ' icon icon-mail'}/>
                    {notifications ?
                        <div className={styles.notificationsWrapper}>
                            <div className={styles.notifications}>
                                {notifications > 99 ? 99 : notifications}
                            </div>
                        </div>
                        : null
                    }
                    <div className={styles.iconText + ' small'}>{strings.messages}</div>
                </div>
                {addingProposal ?
                    <div className={styles.addProposalWrapper} onClick={this.closeAddModal}>
                        <div className={styles.addProposalAbsoluteWrapper}>
                            <div className={styles.addProposal}>
                                <svg width={70 * 2 + 70 * 2} height={70 * 2 + 70 * 2} xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d={this.describeArc(70, 70, 235, 270 + 215)}
                                              fill={'none'} strokeWidth={70} stroke={'white'} strokeLinecap="round"
                                        />
                                        {this.renderIcon('paperclip', 70, 270, '#63CAFF', this.addProfessionalProposal)}
                                        {this.renderIconText(strings.proposal, 70, 270)}
                                        {this.renderIcon('send', 70, 0, '#D380D3',  this.addLeisurePlan)}
                                        {this.renderIconText(strings.leisure, 70, 0)}
                                        {this.renderIcon('compass', 70, 90, '#7BD47E',  this.addExperienceProposal)}
                                        {this.renderIconText(strings.experience, 70, 90)}
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}

BottomNavBar.defaultProps = {
    strings: {
        proposals : 'Proposals',
        persons   : 'Persons',
        plans     : 'Plans',
        messages  : 'Messages',
        proposal  : 'Proposal',
        leisure   : 'Leisure plan',
        experience: 'Experience',
    }
};