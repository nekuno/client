import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import NetworkInformation from '../src/js/components/ui/NetworkInformation/NetworkInformation.js';

storiesOf('NetworkInformation', module)
    .add('with text', () => (
        <NetworkInformation onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </NetworkInformation>
    ))
    .add('with HTML', () => (
        <NetworkInformation onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </NetworkInformation>
    ));