import React, { PropTypes, Component } from 'react';
import * as InterestsActionCreators from '../../actions/InterestsActionCreators';
import translate from '../../i18n/Translate';
import FilterContentButton from "./FilterContentButton";

@translate('FilterContentButtonsList')
export default class FilterContentButtonsList extends Component {

    static propTypes = {
        userId        : PropTypes.number.isRequired,
        contentsCount : PropTypes.number.isRequired,
        ownContent    : PropTypes.bool.isRequired,
        ownUserId     : PropTypes.number,
        onClickHandler: PropTypes.func,
        commonContent : PropTypes.number,
        linksCount    : PropTypes.number,
        audiosCount   : PropTypes.number,
        videosCount   : PropTypes.number,
        imagesCount   : PropTypes.number,
        channelsCount : PropTypes.number,
        loading       : PropTypes.bool,
        type          : PropTypes.string,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    onFilterClick(type) {
        this.filterContent(this.props, type);
    }

    filterContent = function(props, type) {
        if (typeof this.props.onClickHandler === 'function') {
            this.props.onClickHandler(type);
        }
    };

    render() {
        const {linksCount, audiosCount, videosCount, imagesCount, channelsCount, strings, loading, type} = this.props;
        return (
            <div className="filter-content-buttons">
                <div className="content-block">
                    <div className="filter-icons-row-wrapper">
                        <FilterContentButton text={strings.videos} count={videosCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Video')} active={type === 'Video'} icon="video" loading={loading}/>
                        <FilterContentButton text={strings.audios} count={audiosCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Audio')} active={type === 'Audio'} icon="audio" loading={loading}/>
                        <FilterContentButton text={strings.photos} count={imagesCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Image')} active={type === 'Image'} icon="photo" loading={loading}/>
                        <FilterContentButton text={strings.websites} count={linksCount || 0} onClickHandler={this.onFilterClick.bind(this, '')} active={type === ''} icon="web-site" loading={loading}/>
                        <FilterContentButton text={strings.channels} count={channelsCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Creator')} active={type === 'Creator'} icon="channels" loading={loading}/>
                    </div>
                </div>
            </div>
        );
    }
}

FilterContentButtonsList.defaultProps = {
    strings: {
        videos  : 'Videos',
        audios  : 'Audios',
        photos  : 'Photos',
        websites: 'All',
        people  : 'People',
        channels: 'Channels'
    },
    loading: false,
    type   : ''
};