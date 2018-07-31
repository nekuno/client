import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ProgressBar from '../components/ui/ProgressBar/ProgressBar.js';

storiesOf('ProgressBar', module)
    .add('progression 0%', () => (
        <ProgressBar percentage={0} onClickHandler={linkTo('ProgressBar', 'progression 100%')} title={'Lorem ipsum'}/>
    ))
    .add('progression 100%', () => (
        <ProgressBar percentage={100} onClickHandler={linkTo('ProgressBar', 'progression 0%')} title={'Lorem ipsum'}/>
    ))
    .add('short text, 10%', () => (
        <ProgressBar percentage={10} onClickHandler={action('clicked')} title={'Lorem ipsum'}/>
    ))
    .add('long text, 90%', () => (
        <ProgressBar percentage={90} onClickHandler={action('clicked')} title={'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'}/>
    ));