import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ProgressBar from '../src/js/components/ui/ProgressBar/ProgressBar.js';

storiesOf('ProgressBar', module)
    .add('progression 0%', () => (
        <ProgressBar percentage={0} onClickHandler={linkTo('ProgressBar', 'progression 100%')} title={'Lorem ipsum'} size={'large'}/>
    ))
    .add('progression 100%', () => (
        <ProgressBar percentage={100} onClickHandler={linkTo('ProgressBar', 'progression 0%')} title={'Lorem ipsum'} size={'large'}/>
    ))
    .add('short text, 10%', () => (
        <ProgressBar percentage={10} onClickHandler={action('clicked')} size={'large'} title={'Lorem ipsum'}/>
    ))
    .add('long text, 90%', () => (
        <ProgressBar percentage={90} onClickHandler={action('clicked')} size={'large'} title={'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'}/>
    ))
    .add('small, 90%', () => (
        <div style={{width: "50%"}}>
            <ProgressBar percentage={90} onClickHandler={action('clicked')} size={'small'} title={'Sed ut perspiciatis'}/>
        </div>
    ))
    .add('medium, 10%', () => (
        <div style={{width: "75%"}}>
            <ProgressBar percentage={90} onClickHandler={action('clicked')} size={'medium'} title={'Sed ut perspiciatis'}/>
        </div>
    ))
    .add('without number, 10%', () => (
        <ProgressBar percentage={10} onClickHandler={action('clicked')} size={'large'} title={'Lorem ipsum'} withoutNumber={'true'}/>
    ))
    .add('progression 50% with text color', () => (
        <ProgressBar percentage={50} textColor={'#cd201f'} onClickHandler={linkTo('ProgressBar', 'progression 0%')} title={'Lorem ipsum'} size={'large'}/>
    ));