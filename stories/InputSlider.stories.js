import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import InputSlider from '../src/js/components/ui/InputSlider/InputSlider';

storiesOf('InputSlider', module).add('with text', () => (
        <InputSlider
            handleChangeIntegerInput={action('changed')}
            data={200}>
        </InputSlider>
    ));