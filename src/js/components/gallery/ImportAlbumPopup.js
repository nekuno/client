import React, { PropTypes, Component } from 'react';
import { FACEBOOK_PHOTOS_SCOPE, GOOGLE_PHOTOS_SCOPE } from '../../constants/Constants';
import translate from '../../i18n/Translate';

@translate('ImportAlbumPopup')
export default class ImportAlbumPopup extends Component {

    static propTypes = {
        onAlbumClickHandler     : PropTypes.func,
        onFileUploadClickHandler: PropTypes.func,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    onResourceClick(resource, scope) {
        this.props.onAlbumClickHandler(resource, scope);
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
                        <div className="icon-wrapper text-facebook" onClick={this.onResourceClick.bind(this, 'facebook', FACEBOOK_PHOTOS_SCOPE)}>
                            <span className="icon icon-facebook"></span>
                        </div>
                        <div className="icon-wrapper text-google" onClick={this.onResourceClick.bind(this, 'google', GOOGLE_PHOTOS_SCOPE)}>
                            <span className="icon icon-google"></span>
                        </div>
                    </div>
                    <div className="upload-wrapper" onClick={this.props.onFileUploadClickHandler}>
                        <div className="button button-fill button-round">
                            <span className="icon icon-uploadthin"></span> <span className="">{strings.uploadFromDevice}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ImportAlbumPopup.defaultProps = {
    strings: {
        close           : 'Close',
        importAlbum     : 'Import an album',
        uploadFromDevice: 'Upload from device'
    }
};