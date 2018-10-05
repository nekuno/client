import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TopNavBar from '../src/js/components/TopNavBar/TopNavBar.js';
import Overlay from '../src/js/components/ui/Overlay/Overlay.js';

storiesOf('TopNavBar', module)
    .add('with left arrow icon and positioned absolute', () => (
        <div style={{position: 'relative', height: '500px', background: '#756EE5'}}>
            <TopNavBar
                position={'absolute'}
                background={'transparent'}
                iconLeft={'arrow-left'}
                textCenter={'Lorem ipsum'}
            />
            <Overlay/>
        </div>
    ))
    .add('with left arrow icon and positioned relative', () => (
        <div style={{position: 'relative', height: '500px', background: '#756EE5'}}>
            <TopNavBar
                iconLeft={'arrow-left'}
                textCenter={'Lorem ipsum'}
            />
            <Overlay/>
        </div>
    ))
    .add('with left arrow icon, small size and positioned absolute', () => (
        <div style={{position: 'relative', height: '500px', background: '#756EE5'}}>
            <TopNavBar
                position={'absolute'}
                background={'transparent'}
                textSize={'small'}
                iconLeft={'arrow-left'}
                textCenter={'Lorem ipsum'}
            />
            <Overlay/>
        </div>
    ))
    .add('with left arrow icon, aligned left and positioned absolute', () => (
        <div style={{position: 'relative', height: '500px', background: '#756EE5'}}>
            <TopNavBar
                position={'absolute'}
                background={'transparent'}
                textAlign={'left'}
                iconLeft={'arrow-left'}
                textCenter={'Lorem ipsum'}
            />
            <Overlay/>
        </div>
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
    .add('with back icon and share icon without background and colored to purple', () => (
        <TopNavBar
            iconLeft={'left-arrow'}
            textCenter={'Lorem ipsum'}
            firstIconRight={'share'}
            iconsRightColor={'#756EE5'}
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
    ))
    .add('with back icon and search input', () => (
        <TopNavBar
            iconLeft={'left-arrow'}
            textCenter={'Lorem ipsum'}
            searchInput={true}
            onRightLinkClickHandler={action('clicked first')}
            onSearchChange={action('input changed')}
        />
    ));