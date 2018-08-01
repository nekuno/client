import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CardUser from '../src/js/components/OtherUser/CardUser/CardUser.js';

storiesOf('CardUser', module)
    .add('Complete card user', () => (
        <CardUser onClickHandler={action('clicked')}
                  photo={'http://via.placeholder.com/100x100'}
                  nickname={'JohnDoe'}
                  age={36}
                  city={'New York'}
                  gender={'Male'}
                  matching={76}
                  similarity={85}
                  coincidences={24}
                  networks={['facebook', 'twitter', 'steam']}
        />
    ))
    .add('Two Complete card user', () => (
        <div>
            <CardUser onClickHandler={action('clicked')}
                      photo={'http://via.placeholder.com/100x100'}
                      nickname={'JohnDoe'}
                      age={36}
                      city={'New York'}
                      gender={'Male'}
                      matching={76}
                      similarity={85}
                      coincidences={24}
                      networks={['facebook', 'twitter', 'steam']}
            />
            <CardUser onClickHandler={action('clicked')}
                      photo={'http://via.placeholder.com/100x100'}
                      nickname={'JaneDoe'}
                      age={30}
                      city={'New Jersey'}
                      gender={'Female'}
                      matching={89}
                      similarity={34}
                      coincidences={101}
                      networks={['tumblr', 'spotify', 'instagram', 'facebook', 'twitter', 'steam']}
            />
        </div>
    ));