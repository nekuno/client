import React from 'react';
import { format } from 'date-fns';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links'
import DateInputRange from '../src/js/components/ui/DateInputRange/DateInputRange.js';

let value = null;

function onChange(newValue) {
    value = newValue;
}

function onCancel() {
    value = null;
}

function getValue() {
    return value;
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
    .add('without default value (spanish)', () => (
        <div>
            <button onClick={linkTo('DateInputRange', 'Step 2 (spanish)')}>Save</button>
            <DateInputRange locale={'es'} placeholder={'Select a date'} onChange={onChange} onCancel={onCancel}/>
        </div>
    ))
    .add('Step 2 (spanish)', () => (
        <div>
            <button onClick={linkTo('DateInputRange', 'Step 3 (spanish)')}>Save</button>
            <DateInputRange locale={'es'} placeholder={'Select a date'} onChange={onChange} defaultValue={getValue()} onCancel={onCancel}/>
        </div>
    ))
    .add('Step 3 (spanish)', () => (
        <div>
            <button onClick={linkTo('DateInputRange', 'Step 2 (spanish)')}>Save</button>
            <DateInputRange locale={'es'} placeholder={'Select a date'} onChange={onChange} defaultValue={getValue()} onCancel={onCancel}/>
        </div>
    ))
    .add('with default value (english)', () => (
        <div>
            <button onClick={linkTo('DateInputRange', 'Step 2 (english)')}>Save</button>
            <DateInputRange locale={'en'} placeholder={'Select a date'} onChange={onChange} defaultValue={getDefaultValue()} onCancel={onCancel}/>
        </div>
    ))
    .add('Step 2 (english)', () => (
        <div>
            <button onClick={linkTo('DateInputRange', 'Step 3 (english)')}>Save</button>
            <DateInputRange locale={'en'} placeholder={'Select a date'} onChange={onChange} defaultValue={getValue()} onCancel={onCancel}/>
        </div>
    ))
    .add('Step 3 (english)', () => (
        <div>
            <button onClick={linkTo('DateInputRange', 'Step 2 (english)')}>Save</button>
            <DateInputRange locale={'en'} placeholder={'Select a date'} onChange={onChange} defaultValue={getValue()} onCancel={onCancel}/>
        </div>
    ));