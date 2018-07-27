import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import LeftPanel from '../components/ui/LeftPanel/LeftPanel.js';

const firstLinksGroup = [
    {
        text: 'Discover',
        path: 'discover'
    },
    {
        text: 'Proposals',
        path: 'proposals'
    },
    {
        text: 'Messages',
        path: 'conversations'
    },
];
const secondLinksGroup = [
    {
        text: 'My Profile',
        path: 'p/johnDoe'
    },
    {
        text: 'Social Networks',
        path: 'social-networks'
    },
    {
        text: 'My Badges',
        path: 'groups'
    },
];
const thirdLinksGroup = [
    {
        text: 'About Nekuno',
        path: 'about'
    },
    {
        text: 'Log out',
        path: 'logout'
    },
];

storiesOf('LeftPanel', module)
    .add('open', () => (
        <LeftPanel handleClickClose={linkTo('LeftPanel', 'close')} isOpen={true}>
            Lorem ipsum
        </LeftPanel>
    ))
    .add('close', () => (
        <LeftPanel handleClickClose={linkTo('LeftPanel', 'open')} isOpen={false}>
            Lorem ipsum
        </LeftPanel>
    ));