import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import styles from './AboutMePage.scss';
import '../../../scss/pages/other-user/proposals.scss';
import translate from '../../i18n/Translate';
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import MatchingStore from "../../stores/MatchingStore";
import SimilarityStore from "../../stores/SimilarityStore";
import ProfileStore from "../../stores/ProfileStore";
import GalleryPhotoStore from "../../stores/GalleryPhotoStore";
import NaturalCategoryStore from "../../stores/NaturalCategoryStore";
import UserStore from "../../stores/UserStore";
import LoginStore from "../../stores/LoginStore";
import * as UserActionCreators from "../../actions/UserActionCreators";
import LoginActionCreators from "../../actions/LoginActionCreators";
import UploadImageService from "../../services/UploadImageService";
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import LoadingGif from "../../components/ui/LoadingGif/LoadingGif";
import UserTopData from "../../components/ui/UserTopData/UserTopData";
import NaturalCategory from "../../components/profile/NaturalCategory/NaturalCategory";
import AboutMeCategory from "../../components/profile/AboutMeCategory/AboutMeCategory";
import SliderPhotos from "../../components/ui/SliderPhotos/SliderPhotos";
import OwnUserBottomNavBar from "../../components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar";
import RoundedIcon from "../../components/ui/RoundedIcon/RoundedIcon";
import Framework7Service from '../../services/Framework7Service';
import RoundedImage from '../../components/ui/RoundedImage/RoundedImage';

function requestData(props) {
    UserActionCreators.requestOwnUserPage(props.params.slug);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {

    const user = LoginStore.user;
    const avatar = LoginStore.photo;

    const username = user.username;
    const slug = user.slug;
    const userId = user.id;

    const profile = ProfileStore.getWithMetadata(slug);
    const isStoreLoading = NaturalCategoryStore.isLoading();
    if ((profile.length === 0) || isStoreLoading) {
        return {isLoading: true}
    }
    const location = profile[0].fields.location.value || '';
    const age = profile[0].fields.birthday.value;

    const photos = GalleryPhotoStore.get(userId);

    const natural = NaturalCategoryStore.get(slug);

    return {
        isLoading: false,
        username,
        location,
        age,
        photos,
        natural,
        slug,
        avatar
    };
}

//TODO: Remove
@AuthenticatedComponent
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
        avatar   : PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.uploadPhoto = this.uploadPhoto.bind(this);
        this.goToEdit = this.goToEdit.bind(this);
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        requestData(this.props);
    }

    getPhotos(photos) {
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

    uploadPhoto(e) {
        e.preventDefault();

        const userId = this.props.user.id;
        UploadImageService.uploadPhoto(e, userId);
    }

    goToEdit() {
        const {slug} = this.props;
        this.context.router.push('/p/' + slug + '/edit');
    }

    logout() {
        Framework7Service.nekunoApp().modal({
            buttons: [
                {
                    text: ReactDOMServer.renderToStaticMarkup(
                        <span className={styles.logoutDismiss}>
                            {this.props.strings.logoutDismiss}
                        </span>
                        ),
                },
                {
                    text: ReactDOMServer.renderToStaticMarkup(
                        <span className={styles.logoutAccept}>
                            {this.props.strings.logoutAccept}
                        </span>
                        ),
                    onClick: () => LoginActionCreators.logoutUser(),
                },
            ],
            text: ReactDOMServer.renderToStaticMarkup(
                <div className={styles.logoutContent}>
                    <RoundedImage url={this.props.avatar} size="medium" />
                    <span className={styles.text}>
                        {this.props.strings.logoutConfirm}
                    </span>
                </div>
            ),
        });
    }

    render() {
        const {photos, isLoading, username, location, age, natural, strings} = this.props;

        return (
            <div className="views">
                <div className={"view " + styles.view}>
                    <div className={styles.topNavBar}>
                        <TopNavBar
                            isLeftBack={true}
                            background={'transparent'}
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
                            <div className={styles.uploadWrapper}>
                                <div className={styles.roundedIcon}><RoundedIcon icon="image" size="medium" background="lightgray"/></div>
                                <div className={styles.input}><input style={{opacity: 0}} type='file' ref='fileInput' onChange={this.uploadPhoto}/></div>
                            </div>

                            <div className={styles.centerLine}>
                                <div className={styles.topData}>
                                    <UserTopData username={username} age={age} location={{locality: location}} usernameColor={'black'} subColor={'grey'}/>
                                </div>
                                <div className={styles.editLink} onClick={this.goToEdit}>
                                    {strings.edit}
                                </div>
                            </div>


                            {this.getNatural(natural)}
                        </div>
                    }
                </div>

                <div className={styles.navbarWrapper}>
                    <OwnUserBottomNavBar current={'about-me'}/>
                </div>
            </div>
        );
    }
}