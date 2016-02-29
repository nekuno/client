import React, { PropTypes, Component } from 'react';
import LeftMenuRightSearchTopNavbar from '../components/ui/LeftMenuRightSearchTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import CardContentList from '../components/interests/CardContentList';
import FilterContentPopup from '../components/ui/FilterContentPopup';

function getState(props) {
    // TODO: Get contents from ContentStore
    const contents = [];
    const pagination = {nextLink: ''};
    return {
        pagination,
        contents
    };
}

// TODO: Connect to ContentStore
@connectToStores([], getState)
export default AuthenticatedComponent(class OtherInterestsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.onSearchClick = this.onSearchClick.bind(this);
    }

    render() {
        // TODO: This is just an example. Get contents from props
        const contents = [
            {
                contentId: 3,
                title: 'Título 1',
                description: 'Descripción 1',
                types: ['Link'],
                url: 'https://nekuno.com',
                embed_id: '',
                embed_type: '',
                thumbnail: '',
                synonymous: [],
                matching: 80,
                rate: false
            },
            {
                contentId: 4,
                title: 'Título 2',
                description: 'Descripción 2',
                types: ['Link'],
                url: 'https://nekuno.com',
                embed_id: '',
                embed_type: '',
                thumbnail: '',
                synonymous: [],
                matching: 70,
                rate: false
            },
            {
                contentId: 5,
                title: 'Título 3',
                description: 'Descripción 3',
                types: ['Link'],
                url: 'https://nekuno.com',
                embed_id: '',
                embed_type: '',
                thumbnail: '',
                synonymous: [],
                matching: 60,
                rate: false
            },
            {
                contentId: 6,
                title: 'Título 4',
                description: 'Descripción 4',
                types: ['Link'],
                url: 'https://nekuno.com',
                embed_id: '',
                embed_type: '',
                thumbnail: '',
                synonymous: [],
                matching: 50,
                rate: false
            }
        ];
        const userId = parseInt(this.props.params.userId);
        return (
            <div className="view view-main">
                <LeftMenuRightSearchTopNavbar centerText={this.props.user.username} onRightLinkClickHandler={this.onSearchClick}/>
                <div data-page="index" className="page other-interests-page">
                    <div id="page-content" className="other-interests-content">
                        <CardContentList contents={contents} userId={userId} />
                        <br />
                        <div className="loading-gif" style={this.props.pagination.nextLink ? {} : {display: 'none'}}></div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <ToolBar links={[
                {'url': `/profile/${this.props.params.userId}`, 'text': 'Acerca de'},
                {'url': `/users/${this.props.params.userId}/other-questions`, 'text': 'Respuestas'},
                {'url': `/users/${this.props.params.userId}/other-interests`, 'text': 'Intereses'}
                ]} activeLinkIndex={2}/>
                {/* TODO: Pass contents count */}
                <FilterContentPopup userId={userId} contentsCount={567} ownContent={false}/>
            </div>
        );
    }

    onSearchClick = function () {
        nekunoApp.popup('.popup-filter-other-contents');
    };
});