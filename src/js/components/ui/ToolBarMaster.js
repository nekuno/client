import PropTypes from "prop-types";
import React, { Component } from "react";
import ToolBar from './ToolBar/';
import translate from '../../i18n/Translate';

@translate('ToolBarMaster')
export default class ToolBarMaster extends Component {
    static propTypes = {
        activeLink              : PropTypes.string,
        // Injected by @translate:
        strings                 : PropTypes.object,
    };

    matchActiveLink(links, activeLink) {
        for (let i = 0; i < links.length; i++) {
            if (links[i].id === activeLink)
                return i;
        }
    }

    render() {
        const { strings, activeLink, ...props } = this.props;
        const links = [
            { id: 'proposals', url: `/proposals`, icon: 'checkbox-multiple-blank' }, // vector-arrange-below
            { id: 'people', url: `/discover`, icon: 'account-multiple' },
            { isCenter: true },
            { id: 'plans', url: `/plans`, icon: 'calendar-heart' },
            { id: 'messages', url: `/conversations`, icon: 'email' },
        ].map(x => ({ ...x, text: strings[x.id] }));
        return <ToolBar links={links} activeLinkIndex={this.matchActiveLink(links, activeLink)} {...props} />;
    }
}
