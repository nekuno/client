import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Image from '../ui/Image';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import * as UserActionCreators from '../../actions/UserActionCreators';
import GalleryPhotoActionCreators from '../../actions/GalleryPhotoActionCreators';
import GalleryPhotoStore from '../../stores/GalleryPhotoStore';

function requestData(props) {
    const userId = parseInt(props.recommendation.id);
    //UserActionCreators.requestUser(userId, ['username', 'email', 'picture', 'status']);
    //GalleryPhotoActionCreators.getOtherPhotos(userId);
}

function getState(props) {
    const otherUserId = parseInt(props.recommendation.id);
    const photos = GalleryPhotoStore.get(otherUserId);
    const noPhotos = GalleryPhotoStore.noPhotos(otherUserId);
    return {
        photos,
        noPhotos
    };
}

@translate('RecommendationUser')
//@connectToStores([GalleryPhotoStore], getState)
export default class RecommendationUser extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        accessibleKey : PropTypes.number.isRequired,
        userId        : PropTypes.number.isRequired
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleMessage = this.handleMessage.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    handleMessage() {
        this.context.history.pushState(null, `/conversations/${this.props.recommendation.id}`);
    }

    render() {
        const {recommendation, accessibleKey, photos, strings} = this.props;
        const defaultSrc = 'img/no-img/big.jpg';
        const matching = Math.round(recommendation.similarity * 100);
        let imgSrc = recommendation.photo ? recommendation.photo.thumbnail.big : defaultSrc;
        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + accessibleKey}>
                    <div className="user-images">
                        <div className="user-images-wrapper">
                            <Link to={`/profile/${recommendation.id}`}>
                                <Image src={imgSrc} defaultSrc={defaultSrc}/>
                            </Link>
                        </div>
                    </div>
                    <Link to={`/profile/${recommendation.id}`} className="username-title">
                        {recommendation.username}
                    </Link>
                    <div className="send-message-button icon-wrapper icon-wrapper-with-text" onClick={this.handleMessage}>
                        <span className="icon-message"></span>
                        <span className="text">{strings.message}</span>
                    </div>
                    <div className="user-description">
                        {recommendation.location ? <span className="icon-marker"></span> : null}
                        {recommendation.location ? ' ' + recommendation.location.substr(0, 20) : null}
                        {recommendation.location && recommendation.location.length > 20 ? '...' : null}
                        {recommendation.location ? ' - ' : null}
                        <span className="similarity">{strings.similarity} {matching ? matching + '%' : '0%'}</span>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

RecommendationUser.defaultProps = {
    strings: {
        similarity: 'Similarity',
        message   : 'Message',
    }
};