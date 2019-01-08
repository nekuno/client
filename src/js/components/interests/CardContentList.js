import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CardContent from '../ui/CardContent/CardContent';
import EmptyMessage from '../ui/EmptyMessage';
import Scroll from '../Scroll/Scroll';
import translate from '../../i18n/Translate';

@translate('CardContentList')
export default class CardContentList extends Component {
    static propTypes = {
        firstItems    : PropTypes.array,
        contents      : PropTypes.array.isRequired,
        onBottomScroll: PropTypes.func,
        isLoading     : PropTypes.bool,
        loadingFirst  : PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.onReport = this.onReport.bind(this);
        this.getCardContents = this.getCardContents.bind(this);
    }

    onReport(contentId, reason) {
        this.props.onReport(contentId, reason);
    }

    buildCardContent(content, index) {
        return <CardContent key={index} {...content} embed_id={content.embed ? content.embed.id : null} embed_type={content.embed ? content.embed.type : null}/>;
    }

    getCardContents() {
        const {contents, isLoading, strings} = this.props;

        if (contents.length === 0) {
            return isLoading ?
                [<div key="empty-message"><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
                : [<div key="empty-message"><EmptyMessage text={strings.empty} loadingGif={false}/></div>];
        }
        return contents.map((content, index) => {
            return this.buildCardContent(content, index);
        });
    }

    render() {
        return (
            <div className="content-list">
                <Scroll
                    items={this.getCardContents()}
                    firstItems={this.props.firstItems}
                    columns={2}
                    onLoad={this.props.onBottomScroll}
                    containerId="interests-view-main"
                    loading={this.props.isLoading}
                />
            </div>
        );
    }
}

CardContentList.defaultProps = {
    strings         : {
        loading: 'Loading interests',
        empty  : 'No interests'
    },
    'firstItems'    : [],
    'onBottomScroll': () => {
    },
    'isLoading'     : false,
    'loadingFirst'  : false,
};