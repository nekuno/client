import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import BottomBar from '../src/js/components/ui/BottomBar/BottomBar.js';

storiesOf('BottomBar', module)
    .add('with text', () => (
        <div>
            <div style={{height: '100vh'}}>Lorem ipsum</div>
            <BottomBar onClickHandler={action('clicked')}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
            </BottomBar>
        </div>
    ))
    .add('with HTML', () => (
        <div>
            <div style={{height: '100vh'}}>Lorem ipsum</div>
            <BottomBar onClickHandler={action('clicked')}>
                <div>Lorem ipsum</div>
            </BottomBar>
        </div>
    ));