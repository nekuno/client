import React from 'react';
import OwnProposalCard from '../../../src/js/components/Proposal/OwnProposalCard/OwnProposalCard.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test OwnProposalCard component', () => {
    const mockFn = jest.fn();
    const ownProposalCard = shallow(<OwnProposalCard title={'Lorem ipsum dolor sit amet'}
                                               image={'http://via.placeholder.com/360x180'}
                                               type={'professional-project'}
                                               photos={['http://via.placeholder.com/100x100/ff0000', 'http://via.placeholder.com/100x100/00ff00', 'http://via.placeholder.com/100x100/0000ff', 'http://via.placeholder.com/100x100/ff0000', 'http://via.placeholder.com/100x100/00ff00']}
                                               nickname={'JohnDoe'}
                                               resume={'Lorem ipsum dolor sit amet'}
                                               onClickHandler={mockFn}/>
    );

    it('should be defined', () => {
        expect(ownProposalCard).toBeDefined();
    });
    it('should render correctly', () => {
        expect(ownProposalCard).toMatchSnapshot();
    });
});
