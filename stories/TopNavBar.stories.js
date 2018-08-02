import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TopNavBar from '../src/js/components/TopNavBar/TopNavBar.js';

storiesOf('TopNavBar', module)
    .add('with left menu icon and messages icon', () => (
        <TopNavBar
            menuIconLeft={true}
            textCenter={'Lorem ipsum'}
            messagesIcon={true}
            messagesCount={45}
        />
    ))
    .add('with left menu icon and messages and proposals icon', () => (
        <TopNavBar
            menuIconLeft={true}
            textCenter={'Lorem ipsum'}
            messagesIcon={true}
            messagesCount={45}
            proposalsIcon={true}
            proposalsCount={200}
        />
    ))
    .add('with left menu icon and messages and proposals icon and long center text', () => (
        <TopNavBar
            menuIconLeft={true}
            textCenter={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.'}
            messagesIcon={true}
            messagesCount={45}
            proposalsIcon={true}
            proposalsCount={200}
        />
    ))
    .add('with left menu icon and share icon with background (no center text)', () => (
        <TopNavBar
            menuIconLeft={true}
            firstIconRight={'plus'}
            iconsRightBackground={'#6C6F82'}
            onRightLinkClickHandler={action('clicked')}
        />
    ))
    .add('with back icon and share icon without background', () => (
        <TopNavBar
            iconLeft={'left-arrow'}
            textCenter={'Lorem ipsum'}
            firstIconRight={'share'}
            onRightLinkClickHandler={action('clicked')}
        />
    ))
    .add('with back icon and two icons without background', () => (
        <TopNavBar
            iconLeft={'left-arrow'}
            textCenter={'Lorem ipsum'}
            firstIconRight={'edit'}
            secondIconRight={'delete'}
            onRightLinkClickHandler={action('clicked first')}
            onSecondRightLinkClickHandler={action('clicked second')}
        />
    ));