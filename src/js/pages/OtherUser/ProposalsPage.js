import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import '../../../scss/pages/other-user/proposals.scss';
import SelectCollapsible from "../../components/ui/SelectCollapsible/SelectCollapsible";
import {action} from "@storybook/addon-actions";
import OwnProposalCard from "../../components/Proposal/OwnProposalCard/OwnProposalCard";

@translate('OtherUserProposalsPage')
export default class ProposalsPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings           : PropTypes.object,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        // this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        // this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
    }


    // topNavBarLeftLinkClick() {
    //     this.context.router.push('/proposals-experience-availability');
    // }
    //
    // topNavBarRightLinkClick() {
    //     this.context.router.push('/proposals-experience-availability');
    // }

    render() {
        const {strings} = this.props;

        const options = [
            {
                id: 'compatibility',
                text: 'Compatibility'
            },
            {
                id: 'similarity',
                text: 'Similarity'
            },
            {
                id: 'coincidences',
                text: 'Coincidences'
            }
        ];

        return (
            <div className="views">
                <div className="view view-main other-user-proposals-view">
                    <TopNavBar
                        background={'FFFFFF'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.topNavBarText}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}/>
                    <div className="other-user-proposals-view-wrapper">
                        <div className="select-collapsible-wrapper">
                            <SelectCollapsible
                                selected={'compatibility'}
                                options={options}
                                title={'Order'}
                                onClickHandler={action('clicked')}/>
                        </div>
                        <OwnProposalCard
                            image={'http://via.placeholder.com/360x180'}
                            title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}
                            description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                            type={'work'}/>
                    </div>
                </div>
            </div>
        );
    }
}

ProposalsPage.defaultProps = {
    strings: {
        topNavBarText : 'Jackson proposals',
        orderBy       : 'Order by Experiences',
    }
};