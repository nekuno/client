import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Input from '../src/js/components/ui/Input/Input.js';

storiesOf('Input', module)
    .add('text input', () => (
        <div style={{background: '#756EE5'}}>
            <Input placeholder={'Write anything'} onChange={action('changed')}/>
        </div>
    ))
    .add('text input with default value', () => (
        <div style={{background: '#756EE5'}}>
            <Input placeholder={'Write anything'} defaultValue={'Lorem ipsum'} onChange={action('changed')}/>
        </div>
    ))
    .add('text input with default value and checked', () => (
        <div style={{background: '#756EE5'}}>
            <Input placeholder={'Write anything'} defaultValue={'Lorem ipsum'} checked={true} onChange={action('changed')}/>
        </div>
    ))
    .add('number input', () => (
        <div style={{background: '#756EE5'}}>
            <Input type={'number'} placeholder={'Write anything'} onChange={action('changed')}/>
        </div>
    ))
    .add('number input with default value', () => (
        <div style={{background: '#756EE5'}}>
            <Input type={'number'}  placeholder={'Write anything'} defaultValue={555} onChange={action('changed')}/>
        </div>
    ))
    .add('number input with default value and checked', () => (
        <div style={{background: '#756EE5'}}>
            <Input type={'number'}  placeholder={'Write anything'} defaultValue={555} checked={true} onChange={action('changed')}/>
        </div>
    ));