import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import FrameCollapsible from '../src/js/components/ui/FrameCollapsible/FrameCollapsible.js';
import Chip from '../src/js/components/ui/Chip/Chip.js';
import Button from '../src/js/components/ui/Button/Button.js';

storiesOf('FrameCollapsible', module)
    .add('with short text', () => (
        <FrameCollapsible title={'Title'}>Lorem ipsum</FrameCollapsible>
    ))
    .add('with components', () => (
        <FrameCollapsible title={'Title'}>
            <Chip text={'foo'} onClickHandler={action('click chip')}/>
            <br/>
            <br/>
            <Button borderColor={'#928BFF'} color={'#928BFF'} onClickHandler={action('clicked button')}>Bar</Button>
        </FrameCollapsible>
    ));