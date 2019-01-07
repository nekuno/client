import React from 'react';
import { storiesOf } from '@storybook/react';
import NaturalCategory from '../src/js/components/profile/NaturalCategory/NaturalCategory.js';

storiesOf('NaturalCategory', module)
    .add('with text', () => (
        <NaturalCategory category={'basic'} text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'/>
    ));