import React from 'react';
import { format } from 'date-fns';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links'
import DateInputRange from '../src/js/components/ui/DateInputRange/DateInputRange.js';

let value = null;

function onChange(newValue) {
    value = newValue;
}

function getDefaultValue() {
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    onChange({
        start: format(today, 'YYYY-MM-DD'),
        end: format(tomorrow, 'YYYY-MM-DD')
    });

    return value;
}

storiesOf('DateInputRange', module)
    .add('without default value', () => (
            <DateInputRange placeholder={'Select a date'} onChange={onChange}/>
    ))
    .add('with default value', () => (
            <DateInputRange placeholder={'Select a date'} onChange={onChange} defaultValue={getDefaultValue()}/>
    ));