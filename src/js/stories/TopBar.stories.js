import React from 'react';
import { storiesOf } from '@storybook/react';
import TopBar from '../components/ui/TopBar/TopBar.js';

storiesOf('TopBar', module)
    .add('with text', () => (
        <TopBar>
            Lorem ipsum
        </TopBar>
    ))
    .add('with HTML', () => (
        <TopBar>
            <div>Lorem ipsum</div>
        </TopBar>
    ));