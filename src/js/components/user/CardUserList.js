import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../utils/connectToStores';
import AuthenticatedComponent from '../AuthenticatedComponent';
import CardUser from '../cardUsers/CardUser';
import selectn from 'selectn';
import ChatUserStatusStore from '../../stores/ChatUserStatusStore';
import InfiniteScroll from "../scroll/InfiniteScroll";
import CardUserPlaceholder from "../cardUsers/CardUserPlaceholder";

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || {};

    return {
        onlineUserIds
    };
}

@AuthenticatedComponent
@connectToStores([ChatUserStatusStore], getState)
export default class CardUserList extends Component {

    static propTypes = {
        recommendations       : PropTypes.array.isRequired,
        user                  : PropTypes.object.isRequired,
        profile               : PropTypes.object.isRequired,
        handleSelectProfile   : PropTypes.func.isRequired,
        onBottomScroll        : PropTypes.func,
        isLoading             : PropTypes.bool,
        isFirstLoading        : PropTypes.bool,
        orientationMustBeAsked: PropTypes.bool,
        //Injected by connectToStores
        onlineUserIds         : PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.getCardUsers = this.getCardUsers.bind(this);
        this.onResize = this.onResize.bind(this);

        this.state = {
            itemHeight: this.getItemHeight()
        }
    }

    buildCardUser(recommendation, index) {
        const {user, profile, onlineUserIds, handleSelectProfile, orientationMustBeAsked} = this.props;

        return <CardUser
            key={index}
            userId={recommendation.id}
            username={recommendation.username}
            location={selectn('profile.location.locality', recommendation) || selectn('profile.location.country', recommendation) || ''}
            canSendMessage={true}
            photo={recommendation.photo}
            matching={Math.round(recommendation.matching * 100)}
            similarity={Math.round(recommendation.similarity * 100)}
            age={recommendation.age}
            like={recommendation.like}
            hideLikeButton={false}
            loggedUserSlug={user.slug}
            profile={profile}
            handleSelectProfile={handleSelectProfile}
            online={onlineUserIds.some(id => id === recommendation.id)}
            slug={recommendation.slug}
            topLinks={recommendation.topLinks}
            sharedLinks={recommendation.sharedLinks}
            orientationMustBeAsked={orientationMustBeAsked}
        />
    }

    getCardUsers() {
        if (this.props.isFirstLoading) {
            return this.getPlaceholders();
        }
        return this.props.recommendations.map((recommendation, index) => {
            return this.buildCardUser(recommendation, index);
        })
    }

    getPlaceholders() {
        const placeholdersAmount = 10;
        let placeholders = [];
        for (let i = 0; i < placeholdersAmount; i++) {
            let key = 'placeholder' + i;
            placeholders.push(<CardUserPlaceholder key={key}/>);
        }
        return placeholders
    }

    getItemHeight() {
        const iW = window.innerWidth;
        const photoHeight = iW >= 480 ? 230.39 : iW / 2 - 4 * iW / 100;
        const bottomHeight = 137;

        return photoHeight + bottomHeight
    }

    onResize() {
        this.setState({itemHeight: this.getItemHeight()});
    }

    render() {
        return (
            <div className="user-list" id="user-list">
                <InfiniteScroll
                    items={this.getCardUsers()}
                    itemHeight={this.getItemHeight()}
                    onResize={this.onResize}
                    firstItems={this.props.firstItems}
                    columns={2}
                    onInfiniteLoad={this.props.onBottomScroll}
                    containerId="discover-view-main"
                    loading={this.props.isLoading}
                />
            </div>
        );
    }

}
