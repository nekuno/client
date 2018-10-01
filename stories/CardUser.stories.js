import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CardUser from '../src/js/components/OtherUser/CardUser/CardUser.js';

storiesOf('CardUser', module)
    .add('Small card user', () => (
        <CardUser onClickHandler={action('clicked')}
                  photo={'http://via.placeholder.com/250x250'}
                  nickname={'JohnDoe'}
                  age={36}
                  city={'New York'}
                  gender={'Male'}
                  matching={76}
                  similarity={85}
                  coincidences={24}
                  networks={['facebook', 'twitter', 'steam']}
                  size={'small'}
                  resume={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        />
    ))
    .add('Medium card user', () => (
        <CardUser onClickHandler={action('clicked')}
                  photo={'http://via.placeholder.com/250x250'}
                  nickname={'JohnDoe'}
                  age={36}
                  city={'New York'}
                  gender={'Male'}
                  matching={76}
                  similarity={85}
                  coincidences={24}
                  networks={['facebook', 'twitter', 'steam']}
                  size={'medium'}
                  resume={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        />
    ))
    .add('Two Small card user', () => (
        <div>
            <CardUser onClickHandler={action('clicked')}
                      photo={'http://via.placeholder.com/250x250'}
                      nickname={'JohnDoe'}
                      age={36}
                      city={'New York'}
                      matching={76}
                      similarity={85}
                      coincidences={24}
                      size={'small'}
            />
            <CardUser onClickHandler={action('clicked')}
                      photo={'http://via.placeholder.com/250x250'}
                      nickname={'JaneDoe'}
                      age={30}
                      city={'New Jersey'}
                      matching={89}
                      similarity={34}
                      coincidences={101}
                      size={'small'}
            />
        </div>
    ));