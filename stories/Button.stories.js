import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../src/js/components/ui/Button/Button.js';

storiesOf('Button', module)
    .add('with short text', () => (
        <div style={{height: '300px', background: '#756EE5'}}>
            <Button onClickHandler={action('clicked')}>
                Lorem ipsum
            </Button>
        </div>
    ))
    .add('with long text', () => (
        <div style={{height: '300px', background: '#756EE5'}}>
            <Button onClickHandler={action('clicked')}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante
            </Button>
        </div>
    ))
    .add('with short text and disabled', () => (
        <div style={{height: '300px', background: '#756EE5'}}>
            <Button disabled={true} onClickHandler={action('clicked')}>
                Lorem ipsum
            </Button>
        </div>
    ));