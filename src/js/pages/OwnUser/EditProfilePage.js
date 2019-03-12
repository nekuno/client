import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './EditProfilePage.scss';
import connectToStores from "../../utils/connectToStores";
import UserStore from "../../stores/UserStore";
import ProfileStore from "../../stores/ProfileStore";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import ButtonOverlayBottomPage from "../../components/ui/ButtonOverlayBottomPage/ButtonOverlayBottomPage";
import LoadingGif from "../../components/ui/LoadingGif/LoadingGif";
import ProfileDataList from "../../components/profile/ProfileDataList";
import translate from "../../i18n/Translate";
import * as UserActionCreators from "../../actions/UserActionCreators";

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const user = props.user;

    if (!user.username) {
        return {isLoading: true}
    }
    const username = user.username;
    const slug = user.slug;

    const profileWithMetadata = ProfileStore.getWithMetadata(slug);
    const profile = ProfileStore.get(slug);
    const categories = ProfileStore.getCategories();
    const metadata = ProfileStore.getMetadata();

    const isStoreLoading = !profileWithMetadata || !categories;
    if ((profile.length === 0) || isStoreLoading) {
        return {isLoading: true}
    }

    const isEditing = ProfileStore.isEditing();

    return {
        isLoading: false,
        username,
        profile,
        profileWithMetadata,
        metadata,
        isEditing
    };
}

@AuthenticatedComponent
@translate('EditProfilePage')
@connectToStores([UserStore, ProfileStore], getState)
export default class EditProfilePage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                      : PropTypes.object.isRequired,
        // Injected by React Router:
        params           : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @connectToStores:
        isLoading          : PropTypes.bool.isRequired,
        username           : PropTypes.string,
        profile            : PropTypes.object,
        profileWithMetadata: PropTypes.array,
        metadata           : PropTypes.object,
        isEditing          : PropTypes.bool
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            oldProfile: {},
            newProfile: {}
        };

        this.goToProfile = this.goToProfile.bind(this);
        this.saveToState = this.saveToState.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile) {
            this.setState({
                newProfile: nextProps.profile
            });
        }
    }

    saveToState(oldProfile, newProfile) {
        this.state.oldProfile = oldProfile;
        this.state.newProfile = newProfile;
    }

    save() {
        UserActionCreators.editProfile(this.state.newProfile, this.state.oldProfile).then(() => {
            this.goToProfile();
        });
    }

    goToProfile() {
        // const slug = this.props.params.slug;
        const { user } = this.props;
        this.context.router.push('/p/' + user.slug);
    }

    render() {
        const { isLoading, isEditing, strings, profile, profileWithMetadata, metadata, user, params } = this.props;
        const { slug } = params;

        if (user.slug && (slug !== user.slug)) {
            this.goToProfile();
        }

        return (
            <div className='views'>
                <TopNavBar
                    background={'#F6F6F6'}
                    textCenter={strings.top}
                    firstIconRight={'x'}
                    onRightLinkClickHandler={this.goToProfile}
                />

                <div className={styles.view}>
                    {isLoading ? <div className={styles.loading}><LoadingGif/></div>
                        :
                        <ProfileDataList profile={profile} profileWithMetadata={profileWithMetadata} metadata={metadata} saveProfile={this.saveToState}/>
                    }
                </div>
                {isEditing ?
                    <div className={styles.loadingEditing}><LoadingGif/></div>
                    :
                    <ButtonOverlayBottomPage text={strings.bottom} onClickHandler={this.save}/>
                }
            </div>
        );
    }
}

EditProfilePage.defaultProps = {
    strings: {
        top   : 'Edit profile',
        bottom: 'Save changes'
    }
};