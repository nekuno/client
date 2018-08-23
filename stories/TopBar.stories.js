import React from 'react';
import { storiesOf } from '@storybook/react';
import TopBar from '../src/js/components/ui/TopBar/TopBar.js';

storiesOf('TopBar', module)
    .add('positioned relative', () => (
        <div>
            <TopBar>
                Lorem ipsum
            </TopBar>
            <div style={{background: 'transparent'}}>
                <img src="http://via.placeholder.com/500x500" style={{width: '100%'}}/>
            </div>
        </div>
    ))
    .add('positioned absolute', () => (
        <div>
            <TopBar position={'absolute'} background={'transparent'}>
                Lorem ipsum
            </TopBar>
            <div style={{background: 'transparent'}}>
                <img src="http://via.placeholder.com/500x500" style={{width: '100%'}}/>
            </div>
        </div>
    ));