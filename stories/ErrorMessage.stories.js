import React from 'react';
import { storiesOf } from '@storybook/react';
import ErrorMessage from '../src/js/components/ui/ErrorMessage/ErrorMessage.js';

storiesOf('ErrorMessage', module)
    .add('with short text', () => (
        <div style={{height: '300px'}}>
            <ErrorMessage text={'Lorem ipsum'}/>
        </div>
    ))
    .add('with large text', () => (
        <div style={{height: '300px'}}>
            <ErrorMessage text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.'}/>
        </div>
    ));