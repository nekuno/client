import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import '../../../scss/pages/other-user/proposals.scss';
import SelectCollapsible from "../../components/ui/SelectCollapsible/SelectCollapsible";
import {action} from "@storybook/addon-actions";
import OtherUserProposalCard from "../../components/ui/OtherUserProposalCard/OtherUserProposalCard";
import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import UserStore from "../../stores/UserStore";
import * as UserActionCreators from "../../actions/UserActionCreators";
import OtherUserBottomNavBar from "../../components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar";

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    UserActionCreators.requestUser(props.params.slug, ['username']);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {params} = props;
    const slug = params.slug;
    const otherUser = UserStore.getBySlug(slug);
    const proposals = otherUser ? otherUser.proposals : null;

    return {
        slug,
        otherUser,
        proposals,
    };
}

@AuthenticatedComponent
@translate('OtherUserProposalsPage')
@connectToStores([UserStore], getState)
export default class ProposalsPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params    : PropTypes.shape({
            slug : PropTypes.string,
        }),
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        otherUser : PropTypes.object,
        proposals : PropTypes.array,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.handleClickOtherUserProposalCard = this.handleClickOtherUserProposalCard.bind(this);

        this.onClickSelectCollapsible = this.onClickSelectCollapsible.bind(this);

        this.state = null;
    }

    componentDidMount() {
        window.setTimeout(() => requestData(this.props), 0);
    }

    topNavBarLeftLinkClick() {
        // this.context.router.push('/proposals-experience-availability');
    }

    handleClickOtherUserProposalCard() {

    }

    onClickSelectCollapsible(id) {
        const {proposals} = this.props;
        // console.log(proposals);
        // console.log(this.state.proposals);
        this.setState({
            proposals: this.orderBy(id, proposals)
        });
    }

    orderBy(needle, haystack) {
        let haystackWithNeedles = [];
        haystack.forEach(function (item, key) {
            if (needle.includes(item.type)) {
                haystackWithNeedles.push(item);
            }
        });
        haystack.forEach(function (item, key) {
            if (!needle.includes(item.type)) {
                haystackWithNeedles.push(item);
            }
        });
        return haystackWithNeedles;
    }


    render() {
        const {strings, otherUser, proposals} = this.props;

        console.log('onRender');
        console.log(proposals);

        const options = [
            {
                id: 'work',
                text: 'Trabajo'
            },
            {
                id: 'sports',
                text: 'Ocio'
            },
            {
                id: 'shows',
                text: 'Experiencia'
            }
        ];

        return (
            <div className="views">
                <div className="view view-main other-user-proposals-view">
                    <TopNavBar
                        background={'FFFFFF'}
                        iconLeft={'arrow-left'}
                        textCenter={otherUser ? strings.topNavBarText.replace('%username%', otherUser.username) : ''}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}/>
                    <div className="other-user-proposals-view-wrapper">
                        <div className="select-collapsible-wrapper">
                            <SelectCollapsible
                                selected={'work'}
                                options={options}
                                onClickSelectCollapsible={this.onClickSelectCollapsible}
                                title={strings.orderBy.replace('%orderBy%', 'Experiences')}/>

                        </div>
                        {proposals ?
                            proposals.map((proposal, proposalIndex) =>
                                <div key={proposalIndex}>
                                    <OtherUserProposalCard
                                        image={proposal.fields.photo ? proposal.fields.photo : 'http://via.placeholder.com/360x180'}
                                        title={proposal.fields.title}
                                        description={proposal.fields.description}
                                        type={proposal.type}
                                        onClickHandler={this.handleClickOtherUserProposalCard}/>
                                </div>
                            )
                            : ''
                        }

                    </div>
                </div>
                <OtherUserBottomNavBar userSlug={otherUser && otherUser.slug} current={'proposals'}/>
            </div>
        );
    }
}

ProposalsPage.defaultProps = {
    strings: {
        topNavBarText : '%username% proposals',
        orderBy       : 'Order by %orderBy%',
    }
};