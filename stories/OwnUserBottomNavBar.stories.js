import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import OwnUserBottomNavBar from '../src/js/components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar.js';

storiesOf('OwnUserBottomNavBar', module)
    .add('about me', () => (
        <OwnUserBottomNavBar current='about-me' />
    ));