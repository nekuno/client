import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './AboutMePage.scss';
import translate from '../../i18n/Translate';
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import '../../../scss/pages/other-user/proposals.scss';
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
import SliderPhotos from "../../components/ui/SliderPhotos/SliderPhotos";
import OtherUserBottomNavBar from "../../components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar";

function requestData(props) {
    UserActionCreators.requestOwnUserPage(props.params.slug);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {

    const user = LoginStore.user;

    const username = user.username;
    const slug = user.slug;
    const userId = user.id;

    const profile = ProfileStore.getWithMetadata(slug);
    if (profile.length === 0) {
        return {isLoading: true}
    }
    const location = profile[0].fields.location.value || '';
    const age = profile[0].fields.birthday.value;

    const photos = GalleryPhotoStore.get(userId);

    const natural = NaturalCategoryStore.get(slug);

    return {
        isLoading  : false,
        username,
        location,
        age,
        photos,
        natural,
        slug
    };
}

@translate('OwnUserAboutMePage')
@connectToStores([UserStore, MatchingStore, SimilarityStore, ProfileStore, GalleryPhotoStore, NaturalCategoryStore], getState)
export default class AboutMePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        isLoading: PropTypes.bool.isRequired,
        username : PropTypes.string,
        location : PropTypes.string,
        age      : PropTypes.string,
        photos   : PropTypes.array,
        slug     : PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    getPhotos(photos) {
        //TODO: TESTING
        return ['https://cdn5.img.sputniknews.com/images/105967/95/1059679556.jpg'];
        return photos.map((photo) => {
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

    logout() {
        alert('Here should be logging out');
    }

    render() {
        const {photos, isLoading, username, location, age, natural, slug} = this.props;

        return (
            <div className="views">
                <div className={"view " + styles.view}>
                    <div className={styles.topNavBar}>
                        <TopNavBar
                            background={'transparent'}
                            iconLeft={'arrow-left'}
                            firstIconRight={'log-out'}
                            textCenter={''}
                            onRightLinkClickHandler={this.logout}
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

                            {this.getNatural(natural)}
                        </div>
                    }
                </div>

                <div className={styles.navbarWrapper}>
                    <OtherUserBottomNavBar userSlug={slug} current={'about-me'}/>
                </div>
            </div>
        );
    }
}