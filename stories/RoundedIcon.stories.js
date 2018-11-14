import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import RoundedIcon from '../src/js/components/ui/RoundedIcon/RoundedIcon.js';

storiesOf('RoundedIcon', module)
    .add('enabled', () => (
        <RoundedIcon icon='facebook' size='medium' background="#3b5998" onClickHandler={linkTo('RoundedIcon', 'disabled')}/>
    ))
    .add('disabled', () => (
        <RoundedIcon disabled={true} icon='facebook' size='medium' background="#3b5998" onClickHandler={linkTo('RoundedIcon', 'enabled')}/>
    ))
    .add('set of small icons', () => (
        <div>
            <RoundedIcon icon='facebook' size='small' background="#3b5998" onClickHandler={action('click on Facebook')}/>
            <RoundedIcon icon='twitter' size='small' background="#55acee" onClickHandler={action('click on Twitter')}/>
            <RoundedIcon icon='youtube' size='small' background="#cd201f" onClickHandler={action('click on Youtube')}/>
            <RoundedIcon icon='spotify' size='small' background="#82b919" onClickHandler={action('click on Spotify')}/>
            <RoundedIcon icon='tumblr' size='small' background="#35465c" onClickHandler={action('click on Tumblr')}/>
        </div>
    ))
    .add('set of medium icons', () => (
        <div>
            <RoundedIcon icon='facebook' size='medium' background="#3b5998" onClickHandler={action('click on Facebook')}/>
            <RoundedIcon icon='twitter' size='medium' background="#55acee" onClickHandler={action('click on Twitter')}/>
            <RoundedIcon icon='youtube' size='medium' background="#cd201f" onClickHandler={action('click on Youtube')}/>
            <RoundedIcon icon='spotify' size='medium' background="#82b919" onClickHandler={action('click on Spotify')}/>
            <RoundedIcon icon='tumblr' size='medium' background="#35465c" onClickHandler={action('click on Tumblr')}/>
        </div>
    ))
    .add('set of large icons', () => (
        <div>
            <RoundedIcon icon='facebook' size='large' background="#3b5998" onClickHandler={action('click on Facebook')}/>
            <RoundedIcon icon='twitter' size='large' background="#55acee" onClickHandler={action('click on Twitter')}/>
            <RoundedIcon icon='youtube' size='large' background="#cd201f" onClickHandler={action('click on Youtube')}/>
            <RoundedIcon icon='spotify' size='large' background="#82b919" onClickHandler={action('click on Spotify')}/>
            <RoundedIcon icon='tumblr' size='large' background="#35465c" onClickHandler={action('click on Tumblr')}/>
        </div>
    ))
    .add('set of small icons with white background and purple color', () => (
        <div style={{background: "#756EE5"}}>
            <RoundedIcon icon='facebook' size='small' background="white" color="#756EE5" onClickHandler={action('click on Facebook')}/>
            <RoundedIcon icon='twitter' size='small' background="white" color="#756EE5" onClickHandler={action('click on Twitter')}/>
            <RoundedIcon icon='youtube' size='small' background="white" color="#756EE5" onClickHandler={action('click on Youtube')}/>
            <RoundedIcon icon='spotify' size='small' background="white" color="#756EE5" onClickHandler={action('click on Spotify')}/>
            <RoundedIcon icon='tumblr' size='small' background="white" color="#756EE5" onClickHandler={action('click on Tumblr')}/>
        </div>
    ))
    .add('set of icons without background', () => (
        <div>
            <RoundedIcon icon='facebook' size='small' onClickHandler={action('click on Facebook')}/>
            <RoundedIcon icon='twitter' size='small' onClickHandler={action('click on Twitter')}/>
            <RoundedIcon icon='youtube' size='small' onClickHandler={action('click on Youtube')}/>
            <RoundedIcon icon='spotify' size='small' onClickHandler={action('click on Spotify')}/>
            <RoundedIcon icon='tumblr' size='small' onClickHandler={action('click on Tumblr')}/>
            <RoundedIcon icon='facebook' size='medium' onClickHandler={action('click on Facebook')}/>
            <RoundedIcon icon='twitter' size='medium' onClickHandler={action('click on Twitter')}/>
            <RoundedIcon icon='youtube' size='medium' onClickHandler={action('click on Youtube')}/>
            <RoundedIcon icon='spotify' size='medium' onClickHandler={action('click on Spotify')}/>
            <RoundedIcon icon='tumblr' size='medium' onClickHandler={action('click on Tumblr')}/>
            <RoundedIcon icon='facebook' size='large' onClickHandler={action('click on Facebook')}/>
            <RoundedIcon icon='twitter' size='large' onClickHandler={action('click on Twitter')}/>
            <RoundedIcon icon='youtube' size='large' onClickHandler={action('click on Youtube')}/>
            <RoundedIcon icon='spotify' size='large' onClickHandler={action('click on Spotify')}/>
            <RoundedIcon icon='tumblr' size='large' onClickHandler={action('click on Tumblr')}/>
        </div>
    ));