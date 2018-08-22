import React from 'react';
import { storiesOf } from '@storybook/react';
import Overlay from '../src/js/components/ui/Overlay/Overlay.js';

storiesOf('Overlay', module)
    .add('overlay over purple', () => (
        <div style={{height: '700px', background: '#756EE5'}}>
            <Overlay/>
        </div>
    ))
    .add('overlay over blue', () => (
        <div style={{height: '700px', background: '#63CAFF'}}>
            <Overlay/>
        </div>
    ))
    .add('overlay over pink', () => (
        <div style={{height: '700px', background: '#D380D3'}}>
            <Overlay/>
        </div>
    ))
    .add('overlay over green', () => (
        <div style={{height: '700px', background: '#7BD47E'}}>
            <Overlay/>
        </div>
    ));