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

import 'framework7/dist/css/framework7.ios.css';
import 'Framework7-3D-Panels/dist/framework7.3dpanels.css';
import 'slick-carousel/slick/slick.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-joyride/lib/react-joyride-compiled.css';
import 'react-infinite-calendar/styles.css';
import 'rc-slider/assets/index.css';
require.context('../scss', false, /\.scss$/);
require.context('../scss/pages', true, /\.scss$/);

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
