import React from 'react';
import ProposalCard from '../../../src/js/components/Proposal/ProposalCard/ProposalCard.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ProposalCard component', () => {
    const mockFn = jest.fn();
    const proposalCard = shallow(<ProposalCard title={'Lorem ipsum dolor sit amet'}
                                               image={'http://via.placeholder.com/360x180'}
                                               type={'work'}
                                               photo={'http://via.placeholder.com/100x100'}
                                               nickname={'JohnDoe'}
                                               age={36}
                                               city={'New York'}
                                               matching={12}
                                               similarity={35}
                                               description={'Lorem ipsum dolor sit amet'}
                                               onClickHandler={mockFn}/>
    );
    it('should be defined', () => {
        expect(ProposalCard).toBeDefined();
    });
    it('should render correctly', () => {
        expect(proposalCard).toMatchSnapshot();
    });
});
