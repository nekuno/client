import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import OtherUserBottomNavBar from '../src/js/components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar.js';

storiesOf('OtherUserBottomNavBar', module)
    .add('with text', () => (
        <OtherUserBottomNavBar onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </OtherUserBottomNavBar>
    ))
    .add('with HTML', () => (
        <OtherUserBottomNavBar onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </OtherUserBottomNavBar>
    ));