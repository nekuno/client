import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CardContent.scss';
import CardIcons from '../CardIcons';
import Image from '../Image';
import LinkImageService from '../../../services/LinkImageService';
import NetworkLine from "../NetworkLine/NetworkLine";
import ContentTypeIcon from "../ContentTypeIcon/ContentTypeIcon";
import translate from "../../../i18n/Translate";

@translate('CardContent')
export default class CardContent extends Component {

    static propTypes = {
        title      : PropTypes.string,
        description: PropTypes.string,
        types      : PropTypes.array.isRequired,
        // network    : PropTypes.string.isRequired,
        url        : PropTypes.string.isRequired,
        embed_id   : PropTypes.string,
        embed_type : PropTypes.string,
        thumbnail  : PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            embedHtml: null
        }
    }

    componentDidMount() {
        if (!window.cordova && this.state.embedHtml && this.props.embed_type === 'facebook') {
            FB.XFBML.parse();
        }
    }

    componentDidUpdate() {
        if (!window.cordova && this.state.embedHtml && this.props.embed_type === 'facebook') {
            FB.XFBML.parse();
        }
    }

    handleClick() {
        const {url, types, embed_type, embed_id} = this.props;

        const isVideo = types.indexOf('Video') > -1;
        if (isVideo && !window.cordova && window.screen.width > 320) {
            this.preVisualizeVideo(embed_type, embed_id, url);
        } else {
            window.cordova ? document.location = url : window.open(url);
        }
    }

    preVisualizeVideo = function(embed_type, embed_id, url) {
        let html = null;
        switch (embed_type) {
            case 'youtube':
                html = <iframe className="discover-video" src={'https://www.youtube.com/embed/' + embed_id + '?autoplay=1'} frameBorder="0" allowFullScreen></iframe>;
                break;
            case 'facebook':
                html = <div className="fb-video" data-href={url} data-show-text="false" data-autoplay="true"></div>;
                break;
            case 'tumblr':
                html = <div dangerouslySetInnerHTML={{__html: embed_id.replace('<video', '<video controls style="width: 100%"')}}></div>;
                break;
            default:
                break;
        }

        this.setState({
            embedHtml: html
        });
    };

    preventDefault(e) {
        e.preventDefault();
    }

    getType(types) {
        return types.find((type) => {
            return type !== 'Link'
        });
    }

    render() {
        const {title, description, types, thumbnail, url, strings} = this.props;
        const cardTitle = title ? title.length > 20 ? title.substr(0, 20) + '...' : title : strings.emptyTitle;
        const subTitle = description ? <div>{description.substr(0, 20)}{description.length > 20 ? '...' : ''}</div> : '';
        const type = this.getType(types);
        const isImage = type === 'Image';
        const footerClassName = isImage ? styles.footerImage : styles.footer;
        const defaultSrc = 'img/default-content-image.jpg';
        let imgSrc = defaultSrc;
        if (thumbnail) {
            imgSrc = thumbnail;
        } else if (isImage) {
            imgSrc = url;
        }
        imgSrc = LinkImageService.getThumbnail(imgSrc, 'medium');
        //TODO: testing:
        imgSrc = 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2017/03/evolucion-link.jpg';

        return (
            <div className={styles.cardContent}>
                {isImage ?
                    <div className={styles.contentImageFullWrapper}>
                        <img src={imgSrc} alt=''/>
                        {/*<NetworkLine network={network}/>*/}
                    </div>
                    :
                    <div>
                        <div className={styles.contentImageWrapper}>
                            <img src={imgSrc} alt=''/>
                        </div>
                        {/*<NetworkLine network={network}/>*/}
                        <div className={styles.cardTitle} onClick={this.handleClick}>
                            <a href={url} onClick={this.preventDefault}>
                                {cardTitle}
                            </a>
                        </div>
                        <div className={styles.cardSubtitle} onClick={this.handleClick}>
                            {subTitle}
                        </div>
                    </div>

                }
                <div className={footerClassName}>
                    <ContentTypeIcon type={type}/>
                </div>
            </div>
        );
    }

}