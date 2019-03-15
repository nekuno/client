import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InputNumberRange from '../src/js/components/ui/InputNumberRange/InputNumberRange.js';

storiesOf('InputNumberRange', module)
    .add('min 8 and max 80', () => (
        <InputNumberRange title={'Lorem ipsum'} minNum={8} maxNum={80} onChangeHandler={action('clicked')} value={[8, 8]}/>
    ))
    .add('min 80 and max 8000', () => (
        <InputNumberRange title={'Lorem ipsum'} minNum={80} maxNum={8000} onChangeHandler={action('clicked')} value={[90, 800]}/>
    ));