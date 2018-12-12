import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import CarouselContinuous from '../src/js/components/ui/CarouselContinuous/CarouselContinuous.js';
import OwnProposalCard from "../src/js/components/Proposal/OwnProposalCard/OwnProposalCard";

const getCards = function() {
    const cards = [];
    for (let i = 0; i<6 ; i++) {
        cards.push(
            <OwnProposalCard title={'Lorem ipsum dolor'}
                             image={'http://via.placeholder.com/360x180'}
                             type={'work'}
                             photos={['http://via.placeholder.com/100x100/928BFF', 'http://via.placeholder.com/100x100/2B3857', 'http://via.placeholder.com/100x100/818FA1', 'http://via.placeholder.com/100x100/63CAFF', 'http://via.placeholder.com/100x100/009688']}
                             description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                             onClickHandler={action('clicked')}/>
        )
    }

    return cards;
};

storiesOf('CarouselContinuous', module)
    .add('with cards', () => (
        <CarouselContinuous items={getCards()} />
    ));