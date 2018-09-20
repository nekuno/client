import 'babel-polyfill';
import './polyfill/manup';
import './hellojs/init';
import React from 'react';
import { render } from 'react-dom';
import { hashHistory } from 'react-router';
import Root from './Root';
import RouterContainer from './services/RouterContainer';
import LoginActionsCreator from './actions/LoginActionCreators';
import Framework7Service from './services/Framework7Service';
import AnalyticsService from './services/AnalyticsService';
import GeocoderService from './services/GeocoderService';
import RecaptchaService from './services/RecaptchaService';
import SocialNetworkService from './services/SocialNetworkService';
import OfflineService from './services/OfflineService';
import '../../node_modules/framework7/dist/css/framework7.ios.css';
import '../../node_modules/Framework7-3D-Panels/dist/framework7.3dpanels.css';
import '../../node_modules/slick-carousel/slick/slick.css';
import '../../node_modules/react-image-crop/dist/ReactCrop.css';
import '../../node_modules/react-joyride/lib/react-joyride-compiled.css';
import '../../node_modules/rc-slider/assets/index.css';
import '../scss/layout.scss';

Framework7Service.init();
OfflineService.check().then(() => {
    AnalyticsService.init();
    RecaptchaService.init();
    GeocoderService.init();
    SocialNetworkService.initFacebookSDK();
    RouterContainer.set(hashHistory);
    LoginActionsCreator.autologin();
    window.nekunoContainer = document.getElementById('root');
    render(<Root history={hashHistory}/>, window.nekunoContainer);
}, (status) => { console.log(status) });