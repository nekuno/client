import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import NetworkLine from '../src/js/components/ui/NetworkLine/NetworkLine.js';

storiesOf('NetworkLine', module)
    .add('google', () => (
        <NetworkLine network="google" />
    ))
    .add('spotify', () => (
        <NetworkLine network="spotify" />
    ))
    .add('twitter', () => (
        <NetworkLine network="twitter" />
    ))
    .add('facebook', () => (
        <NetworkLine network="facebook" />
    ));