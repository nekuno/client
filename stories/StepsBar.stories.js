import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import StepsBar from '../src/js/components/ui/StepsBar/StepsBar.js';

storiesOf('StepsBar', module)
    .add('initial component with 3 steps', () => (
        <div style={{height: '300px'}}>
            <StepsBar totalSteps={3} currentStep={0} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={false} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('can continue', () => (
        <div style={{height: '300px'}}>
            <StepsBar totalSteps={3} currentStep={0} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={linkTo('StepsBar', 'can continue step 2')}/>
        </div>
    ))
    .add('can continue step 2', () => (
        <div style={{height: '300px'}}>
            <StepsBar totalSteps={3} currentStep={1} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={linkTo('StepsBar', 'can continue step 3')}/>
        </div>
    ))
    .add('can continue step 3', () => (
        <div style={{height: '300px'}}>
            <StepsBar totalSteps={3} currentStep={2} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('blue: initial component with 4 steps', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'blue'} totalSteps={4} currentStep={0} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={false} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('blue: can continue', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'blue'} totalSteps={4} currentStep={0} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={linkTo('StepsBar', 'blue: can continue step 2')}/>
        </div>
    ))
    .add('blue: can continue step 2', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'blue'} totalSteps={4} currentStep={1} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={linkTo('StepsBar', 'blue: can continue step 3')}/>
        </div>
    ))
    .add('blue: can continue step 3', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'blue'} totalSteps={4} currentStep={2} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={linkTo('StepsBar', 'blue: can continue step 4')}/>
        </div>
    ))
    .add('blue: can continue step 4', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'blue'} totalSteps={4} currentStep={3} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('pink: initial component with 2 steps (step 2)', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'pink'} totalSteps={2} currentStep={1} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={false} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('pink: can continue step 2', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'pink'} totalSteps={2} currentStep={1} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={linkTo('StepsBar', 'pink: no steps')}/>
        </div>
    ))
    .add('pink: no steps', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'pink'} totalSteps={0} continueText={'Publish proposal'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('green: initial component with 2 steps (step 2)', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'green'} totalSteps={2} currentStep={1} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={false} onClickHandler={action('clicked')}/>
        </div>
    ))
    .add('green: no steps', () => (
        <div style={{height: '300px'}}>
            <StepsBar color={'green'} totalSteps={0} continueText={'Publish proposal'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={action('clicked')}/>
        </div>
    ));