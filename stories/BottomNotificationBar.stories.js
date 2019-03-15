import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import BottomNotificationBar from '../src/js/components/ui/BottomNotificationBar/BottomNotificationBar.js';

storiesOf('BottomNotificationBar', module)
    .add('with percentage null', () => (
        <BottomNotificationBar linksPercentage={null} />
    ))
    .add('with percentage 50%', () => (
        <BottomNotificationBar linksPercentage={50} />
    ))
    .add('with percentage 0% fade in', () => (
        <BottomNotificationBar linksPercentage={0} />
    ))
    .add('with percentage 100% fade out', () => (
        <BottomNotificationBar linksPercentage={100} />
    ));