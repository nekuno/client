import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InputNumber from '../src/js/components/ui/InputNumber/InputNumber.js';

storiesOf('InputNumber', module)
    .add('min 8 and max 80', () => (
        <div style={{background: '#756EE5'}}>
            <InputNumber title={'Lorem ipsum'} placeholder={'Write a number'} minNum={8} maxNum={80} onChange={action('changed')}/>
        </div>
    ))
    .add('min 8 and max 80 with default value of 50', () => (
        <div style={{background: '#756EE5'}}>
            <InputNumber title={'Lorem ipsum'} placeholder={'Write anything'} defaultValue={50} minNum={8} maxNum={80} onChange={action('changed')}/>
        </div>
    ))
    .add('small min 8 and max 80 with default value of 50', () => (
        <div style={{background: '#756EE5'}}>
            <InputNumber title={'Lorem ipsum'} placeholder={'Write anything'} defaultValue={50} minNum={8} maxNum={80} onChange={action('changed')} size={'small'}/>
        </div>
    ));