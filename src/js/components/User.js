import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class User extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { user } = this.props;

        return (
            <div className="User">
                <Link to={`/login/${user.login}`}>
                    <h3>
                        {user.username} {user.email && <span>({user.email})</span>}
                        <img src={`https://dev.nekuno.com/media/cache/resolve/profile_picture/user/images/${user.picture }`} />
                    </h3>
                </Link>
            </div>
        );
    }
}
