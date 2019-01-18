import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CardContentList.scss';
import CardContent from '../ui/CardContent/CardContent';
import EmptyMessage from '../ui/EmptyMessage';
import Scroll from '../Scroll/Scroll';
import translate from '../../i18n/Translate';

@translate('CardContentList')
export default class CardContentList extends Component {
    static propTypes = {
        firstItems       : PropTypes.array,
        contents         : PropTypes.array.isRequired,
        onBottomScroll   : PropTypes.func,
        isLoading        : PropTypes.bool,
        loadingFirst     : PropTypes.bool,
        scrollContainerId: PropTypes.string
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
        //TESTING:
        let contents1 = contents.map((content, index) => {
            return this.buildCardContent(content, index);
        });

        let contents2 = contents.map((content, index) => {
            return this.buildCardContent(content, index);
        });

        let contents3 = contents.map((content, index) => {
            return this.buildCardContent(content, index);
        });

        let contents4 = contents.map((content, index) => {
            return this.buildCardContent(content, index);
        });

        return contents1.concat(contents2).concat(contents3).concat(contents4);
    }

    render() {
        const {scrollContainerId} = this.props;

        return (
            <div className={styles.cardContentList} id={scrollContainerId}>
                <Scroll
                    items={this.getCardContents()}
                    firstItems={this.props.firstItems}
                    columns={2}
                    onLoad={this.props.onBottomScroll}
                    containerId={scrollContainerId}
                    loading={this.props.isLoading}
                />
            </div>
        );
    }
}

CardContentList.defaultProps = {
    strings          : {
        loading: 'Loading interests',
        empty  : 'No interests'
    },
    'firstItems'     : [],
    'onBottomScroll' : () => {
    },
    'isLoading'      : false,
    'loadingFirst'   : false,
    scrollContainerId: 'view'
};