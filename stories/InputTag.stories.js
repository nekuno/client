import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InputTag from '../src/js/components/RegisterFields/InputTag/InputTag.js';

const tags = ["Lorem", "Ipsum", "Lorem ipsum", "Sed ut perspiciatis", "perspiciatis"];

storiesOf('InputTag', module)
    .add('with tags', () => (
        <InputTag onClickHandler={action('clicked')} tags={tags} placeholder={'Search tag'} selectedLabel={'Your selection'}/>
    ));