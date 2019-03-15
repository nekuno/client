import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import SliderPhotos from '../src/js/components/ui/SliderPhotos/SliderPhotos.js';

storiesOf('SliderPhotos', module)
    .add('with some photos', () => (
        <SliderPhotos photos={['https://cdn-images-1.medium.com/max/1600/1*mONNI1lG9VuiqovpnYqicA.jpeg', 'https://r.hswstatic.com/w_907/gif/tesla-cat.jpg', 'https://images.mentalfloss.com/sites/default/files/styles/mf_image_16x9/public/549585-istock-909106260.jpg']} />
    ))
    .add('with one photo', () => (
        <SliderPhotos photos={['https://cdn-images-1.medium.com/max/1600/1*mONNI1lG9VuiqovpnYqicA.jpeg']} />
    ));