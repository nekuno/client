import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links'
import LeftPanel from '../src/js/components/ui/LeftPanel/LeftPanel.js';

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