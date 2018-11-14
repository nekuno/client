import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import LastMessage from '../src/js/components/ui/LastMessage/LastMessage.js';

const shortMessage = {
    text: 'Lorem ipsum',
    createdAt: new Date()
};

const longMessage = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    createdAt: new Date()
};

storiesOf('LastMessage', module)
    .add('with short message', () => (
        <LastMessage slug={'johndoe'}
                     username={'JohnDoe'}
                     photo={'http://via.placeholder.com/100x100'}
                     message={shortMessage}
                     onUserClickHandler={action('user clicked')}
                     onClickHandler={action('message clicked')}
        />
    ))
    .add('with long message and from type professional-proposal', () => (
        <LastMessage slug={'johndoe'}
                     username={'JohnDoe'}
                     photo={'http://via.placeholder.com/100x100'}
                     message={longMessage}
                     proposalType={"professional-project"}
                     onUserClickHandler={action('user clicked')}
                     onClickHandler={action('message clicked')}
        />
    ))
    .add('with long message, from type leisure-plan and online', () => (
        <LastMessage slug={'johndoe'}
                     username={'JohnDoe'}
                     photo={'http://via.placeholder.com/100x100'}
                     message={longMessage}
                     online={true}
                     proposalType={"leisure-plan"}
                     onUserClickHandler={action('user clicked')}
                     onClickHandler={action('message clicked')}
        />
    ));