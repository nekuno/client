import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SelectInline from '../src/js/components/ui/SelectInline/SelectInline.js';

const optionsFour = [
    {
        id: "lorem",
        text: "Lorem"
    },
    {
        id: "ipsum",
        text: "Ipsum"
    },
    {
        id: "lorem-ipsum",
        text: "Lorem ipsum"
    },
    {
        id: "sed-ut-perspiciatis",
        text: "Sed ut perspiciatis"
    }
];
const optionsThree = [
    {
        id: "lorem",
        text: "Lorem"
    },
    {
        id: "ipsum",
        text: "Ipsum"
    },
    {
        id: "lorem-ipsum",
        text: "Lorem ipsum"
    }
];
const optionsTwo = [
    {
        id: "lorem",
        text: "Lorem"
    },
    {
        id: "ipsum",
        text: "Ipsum"
    }
];

storiesOf('SelectInline', module)
    .add('with 4 options and default color', () => (
        <div style={{height: '500px', padding: '20px 0'}}>
            <SelectInline options={optionsFour} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('with three options, multiple and blue color', () => (
        <div style={{height: '500px', padding: '20px 0'}}>
            <SelectInline options={optionsThree} onClickHandler={action('clicked')} multiple={true} color={'blue'}/>
        </div>
    ))
    .add('with two options, multiple and pink color', () => (
        <div style={{height: '500px', padding: '20px 0'}}>
            <SelectInline options={optionsTwo} onClickHandler={action('clicked')} multiple={true} color={'pink'}/>
        </div>
    ))
    .add('with 4 options and green color', () => (
        <div style={{height: '500px', padding: '20px 0'}}>
            <SelectInline options={optionsFour} onClickHandler={action('clicked')} color={'green'}/>
        </div>
    ));