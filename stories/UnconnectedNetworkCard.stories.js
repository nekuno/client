import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import UnconnectedNetworkCard from '../src/js/components/ui/UnconnectedNetworkCard/UnconnectedNetworkCard.js';

storiesOf('UnconnectedNetworkCard', module)
    .add('with text', () => (
        <UnconnectedNetworkCard onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </UnconnectedNetworkCard>
    ))
    .add('with HTML', () => (
        <UnconnectedNetworkCard onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </UnconnectedNetworkCard>
    ));