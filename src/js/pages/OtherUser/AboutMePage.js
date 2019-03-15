import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './AboutMePage.scss';
import translate from '../../i18n/Translate';
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import '../../../scss/pages/other-user/proposals.scss';
import MatchingBars from "../../components/ui/MatchingBars/MatchingBars";
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
import UserTopData from "../../components/ui/UserTopData/UserTopData";
import NaturalCategory from "../../components/profile/NaturalCategory/NaturalCategory";
import AboutMeCategory from "../../components/profile/AboutMeCategory/AboutMeCategory";
import LikeStore from "../../stores/LikeStore";
import { ORIGIN_CONTEXT } from "../../constants/Constants";
import SliderPhotos from "../../components/ui/SliderPhotos/SliderPhotos";
import OtherUserBottomNavBar from "../../components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar";

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
    const matching = MatchingStore.getPercentage(ownUserId, otherUserId);
    const similarity = SimilarityStore.getPercentage(ownUserId, otherUserId);

    const profile = ProfileStore.getWithMetadata(slug);
    if (profile.length === 0) {
        return {isLoading: true}
    }
    const location = profile[0].fields.location.value || '';
    const age = profile[0].fields.birthday.value;

    const photos = GalleryPhotoStore.get(otherUserId);

    const natural = NaturalCategoryStore.get(slug);

    const ownUserSlug = LoginStore.user.slug;
    const liked = LikeStore.get(ownUserSlug, slug);

    return {
        isLoading: false,
        matching,
        similarity,
        username,
        location,
        age,
        photos,
        natural,
        liked,
        ownUserSlug
    };
}

@translate('OtherUserAboutMePage')
@connectToStores([UserStore, MatchingStore, SimilarityStore, ProfileStore, GalleryPhotoStore, NaturalCategoryStore, LikeStore], getState)
export default class AboutMePage extends Component {

    static propTypes = {
        params     : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,        // Injected by @translate:
        strings    : PropTypes.object,
        // Injected by @connectToStores:
        isLoading  : PropTypes.bool.isRequired,
        matching   : PropTypes.number,
        similarity : PropTypes.number,
        username   : PropTypes.string,
        location   : PropTypes.string,
        age        : PropTypes.string,
        photos     : PropTypes.array,
        liked      : PropTypes.bool,
        ownUserSlug: PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    constructor(props) {
        super(props);

        this.toggleLikeUser = this.toggleLikeUser.bind(this);
    }

    toggleLikeUser() {
        const from = this.props.ownUserSlug;
        const to = this.props.params.slug;
        const liked = this.props.liked;

        if (liked) {
            UserActionCreators.dislikeUser(from, to, ORIGIN_CONTEXT.OTHER_USER_PAGE, to);
        } else {
            UserActionCreators.likeUser(from, to, ORIGIN_CONTEXT.OTHER_USER_PAGE, to);
        }
    }

    getPhotos(photos) {
        return photos.map((photo) => {
            // return <img src={photo.url} alt={'photo'}/>
            return photo.url
        })
    }

    getNatural(natural) {
        return Object.keys(natural).map((type) => {
            const text = natural[type];
            return <div key={type} className={styles.naturalCategory}>
                {
                    type === 'About Me' ?
                        <AboutMeCategory text={text}/>
                        :
                        <NaturalCategory category={type} text={text}/>
                }
            </div>

        })
    }

    render() {
        const {photos, matching, similarity, isLoading, username, location, age, natural, liked} = this.props;

        const rightIcon = liked ? 'thumbs-down' : 'thumbs-up';

        return (
            <div className="views">
                <div className={"view " + styles.view}>
                    <div className={styles.topNavBar}>
                        <TopNavBar
                            background={'transparent'}
                            iconLeft={'arrow-left'}
                            firstIconRight={rightIcon}
                            textCenter={''}
                            onRightLinkClickHandler={this.toggleLikeUser}
                        />
                    </div>

                    {isLoading
                        ?
                        <div className={styles.loading}>
                            <LoadingGif/>
                        </div>
                        :
                        <div className={styles.loaded}>
                            <SliderPhotos photos={this.getPhotos(photos)}/>

                            <div className={styles.topData}>
                                <UserTopData username={username} age={age} location={{locality: location}} usernameColor={'black'} subColor={'grey'}/>
                            </div>
                            <div className={styles.matchingBarsWrapper}>
                                <MatchingBars matching={matching} similarity={similarity} background={'transparent'}/>
                            </div>

                            {this.getNatural(natural)}


                        </div>
                    }

                </div>
                <div className={styles.navbarWrapper}>
                    <OtherUserBottomNavBar userSlug={this.props.params.slug} current={'about-me'}/>
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