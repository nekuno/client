import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CardUser from '../src/js/components/OtherUser/CardUser/CardUser.js';

storiesOf('CardUser', module)
    .add('Small card user', () => (
        <CardUser onClickHandler={action('clicked')}
                  photo={{ thumbnail: { medium: 'http://via.placeholder.com/250x250' } }}
                  username={'JohnDoe'}
                  age={36}
                  city={'New York'}
                  gender={'Male'}
                  matching={0.76}
                  similarity={0.85}
                  sharedLinks={24}
                  networks={['facebook', 'twitter', 'steam']}
                  size={'small'}
                  resume={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        />
    ))
    .add('Medium card user', () => (
        <CardUser onClickHandler={action('clicked')}
                  photo={{ thumbnail: { medium: 'http://via.placeholder.com/250x250' } }}
                  username={'JohnDoe'}
                  age={36}
                  city={'New York'}
                  gender={'Male'}
                  matching={0.76}
                  similarity={0.85}
                  sharedLinks={24}
                  networks={['facebook', 'twitter', 'steam']}
                  size={'medium'}
                  resume={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        />
    ))
    .add('Two Small card user', () => (
        <div>
            <CardUser onClickHandler={action('clicked')}
                      photo={{ thumbnail: { medium: 'http://via.placeholder.com/250x250' } }}
                      username={'JohnDoe'}
                      age={36}
                      city={'New York'}
                      matching={0.76}
                      similarity={0.85}
                      sharedLinks={24}
                      size={'small'}
            />
            <CardUser onClickHandler={action('clicked')}
                      photo={{ thumbnail: { medium: 'http://via.placeholder.com/250x250' } }}
                      username={'JaneDoe'}
                      age={30}
                      city={'New Jersey'}
                      matching={0.89}
                      similarity={0.34}
                      sharedLinks={101}
                      size={'small'}
            />
        </div>
    ));