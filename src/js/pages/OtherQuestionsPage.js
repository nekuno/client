import React, { PropTypes, Component } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import OtherQuestionList from '../components/questions/OtherQuestionList';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';
import OtherQuestionsBanner from '../components/questions/OtherQuestionsBanner';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props, state) {
    const {params} = props;
    const userId = parseId(props.user);
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']).then(
        () => {
            const otherUser = UserStore.getBySlug(params.slug);
            const otherUserId = parseId(otherUser);
            QuestionActionCreators.requestComparedQuestions(userId, otherUserId, state.filters);
        },
        (status) => { console.log(status.error) }
    );
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const otherUserSlug = props.params.slug;
    const otherUser = UserStore.getBySlug(otherUserSlug);
    const otherUserId = otherUser ? parseId(otherUser) : null;
    const currentUserId = parseId(props.user);
    const pagination = otherUser ? QuestionStore.getPagination(otherUserId) || {} : {};
    const questions = QuestionStore.get(currentUserId) || {};
    const otherQuestions = otherUser ? QuestionStore.get(otherUserId) || {} : {};

    return {
        pagination,
        questions,
        otherQuestions,
        otherUser
    };
}

@AuthenticatedComponent
@translate('OtherQuestionsPage')
@connectToStores([UserStore, QuestionStore], getState)
export default class OtherQuestionsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params        : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }),
        // Injected by @AuthenticatedComponent
        user          : PropTypes.object.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object,
        // Injected by @connectToStores:
        pagination    : PropTypes.object.isRequired,
        questions     : PropTypes.object,
        otherQuestions: PropTypes.object.isRequired,
        otherUser     : PropTypes.object
    };

    constructor(props) {

        super(props);

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            filters: ['showOnlyCommon']
        }
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props, this.state);
        }
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.slug !== this.props.params.slug) {
            requestData(nextProps);
        }
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            QuestionActionCreators.requestNextComparedQuestions(parseId(this.props.user), parseId(this.props.otherUser), nextLink);
        }
    }

    render() {
        const {otherUser, user, questions, otherQuestions, pagination, strings, params} = this.props;
        const ownPicture = user && user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
        const otherPicture = otherUser && otherUser.photo ? otherUser.photo.thumbnail.small : 'img/no-img/small.jpg';
        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={otherUser ? otherUser.username : ''}/>
                {otherUser ?
                    <ToolBar links={[
                        {'url': `/p/${params.slug}`, 'text': strings.about},
                        {'url': `/users/${params.slug}/other-questions`, 'text': strings.questions},
                        {'url': `/users/${params.slug}/other-interests`, 'text': strings.interests}
                    ]} activeLinkIndex={1} arrowUpLeft={'48%'}/>
                    : null}
                <ScrollContainer scrollKey={"other-questions-" + params.slug}>
                    <div className="view view-main" onScroll={this.handleScroll}>
                        <div className="page other-questions-page">
                            {user && otherUser ?
                                <div id="page-content" className="other-questions-content">
                                    <OtherQuestionsBanner user={otherUser} questionsTotal={pagination.total || Object.keys(questions).length || 0}/>
                                    <div className="other-questions-header-container">
                                        <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherPicture}/>
                                        <div className="other-questions-stats-title title">{pagination.total || 0} {strings.coincidences}</div>
                                    </div>
                                    <OtherQuestionList otherQuestions={otherQuestions} questions={questions} otherUserSlug={otherUser.slug || ''} ownPicture={ownPicture} otherPicture={otherPicture} onTimerEnd={this.onTimerEnd}/>
                                    <div className="loading-gif" style={pagination.nextLink ? {} : {display: 'none'}}></div>
                                    <br />
                                    <br />
                                    <br />
                                </div>
                                : ''
                            }
                        </div>
                    </div>
                </ScrollContainer>
            </div>
        );
    }

};

OtherQuestionsPage.defaultProps = {
    strings: {
        coincidences: 'Coincidences',
        about       : 'About',
        photos      : 'Photos',
        questions   : 'Answers',
        interests   : 'Interests'
    }
};