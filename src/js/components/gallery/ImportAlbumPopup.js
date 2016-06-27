import React, { PropTypes, Component } from 'react';
import { FACEBOOK_SCOPE, GOOGLE_SCOPE } from '../../constants/Constants';
import translate from '../../i18n/Translate';

@translate('ImportAlbumPopup')
export default class ImportAlbumPopup extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    onResourceClick(resource, scope) {
        this.props.onClickHandler(resource, scope);
    }

    render() {
        const {strings} = this.props;

        return (
            <div className="popup popup-import-album tablet-fullscreen">
                <div className="content-block">
                    <p><a className="close-popup">{strings.close}</a></p>
                    <div className="title">{strings.importAlbum}</div>
                    <br />
                    <div className="social-icons-row-wrapper social-box">
                        <div className="icon-wrapper text-facebook" onClick={this.onResourceClick.bind(this, 'facebook', FACEBOOK_SCOPE)}>
                            <span className="icon icon-facebook"></span>
                        </div>
                        <div className="icon-wrapper text-google" onClick={this.onResourceClick.bind(this, 'google', GOOGLE_SCOPE)}>
                            <span className="icon icon-google"></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

ImportAlbumPopup.defaultProps = {
    strings: {
        close      : 'Close',
        importAlbum: 'Import an album'
    }
};