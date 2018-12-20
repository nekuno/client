import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import '../../../scss/pages/other-user/proposals.scss';
import MatchingBars from "../../components/ui/MatchingBars/MatchingBars";
import CarouselContinuous from "../../components/ui/CarouselContinuous/CarouselContinuous";
import connectToStores from "../../utils/connectToStores";
import MatchingStore from "../../stores/MatchingStore";
import SimilarityStore from "../../stores/SimilarityStore";
import ProfileStore from "../../stores/ProfileStore";
import GalleryPhotoStore from "../../stores/GalleryPhotoStore";
import NaturalCategoryStore from "../../stores/NaturalCategoryStore";
import * as UserActionCreators from "../../actions/UserActionCreators";
import UserStore from "../../stores/UserStore";
import LoginStore from "../../stores/LoginStore";
import LoadingGif from "../../components/ui/LoadingGif/LoadingGif";

function requestData(props) {
    UserActionCreators.requestOtherUserPage(props.params.slug);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const slug = props.params.slug;

    const otherUser = UserStore.getBySlug(slug);
    if (!otherUser) {
        return {isLoading: true}
    }

    const username = otherUser.username;

    const otherUserId = otherUser ? otherUser.id : null;

    const ownUserId = LoginStore.user.id;
    const matching = MatchingStore.get(ownUserId, otherUserId);
    const similarity = SimilarityStore.get(ownUserId, otherUserId);

    const profile = ProfileStore.getWithMetadata(slug);
    if (profile.length === 0){
        return {isLoading: true}
    }
    const location = profile[0].fields.location.value;
    const age = profile[0].fields.birthday.value;

    const photos = GalleryPhotoStore.get(otherUserId);

    return {
        isLoading: false,
        matching,
        similarity,
        username,
        location,
        age,
        photos
    };
}

@translate('OtherUserAboutMePage')
@connectToStores([UserStore, MatchingStore, SimilarityStore, ProfileStore, GalleryPhotoStore, NaturalCategoryStore], getState)
export default class AboutMePage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        isLoading : PropTypes.bool.isRequired,
        matching  : PropTypes.number,
        similarity: PropTypes.number,
        username  : PropTypes.string,
        // location  : PropTypes.string,
        age       : PropTypes.string,
        photos: PropTypes.array
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    constructor(props) {
        super(props);

        this.goBack = this.goBack.bind(this);
        this.likeUser = this.likeUser.bind(this);
        this.dislikeUser = this.dislikeUser.bind(this);
    }

    goBack() {

    }

    likeUser() {

    }

    dislikeUser() {

    }

    getPhotos(photos) {
        return photos.map((photo) => {
            return <img src={photo.url} />
        })
    }
    render() {
        const {strings, photos, matching, similarity, isLoading} = this.props;

        return (
            <div className="views">
                <div className="view view-main other-user-proposals-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'} //empty or filled heart
                        textCenter={''}
                        onLeftLinkClickHandler={this.goBack}
                        onRightLinkClickHandler={this.likeUser}
                    />

                    {isLoading
                        ?
                        <LoadingGif/>
                        :
                        <div>
                            <CarouselContinuous items={this.getPhotos(photos)}/>
                            <MatchingBars matching={matching} similarity={similarity}/>
                        </div>
                    }


                </div>
            </div>
        );
    }
}

AboutMePage.defaultProps = {
    strings: {
        orderBy: 'Order by Experiences',
    }
};