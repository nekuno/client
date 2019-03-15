import React from 'react';
import OtherUserProposalCard from '../../../src/js/components/ui/OtherUserProposalCard/OtherUserProposalCard.js';
import styles from '../../../src/js/components/ui/OtherUserProposalCard/OtherUserProposalCard.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test OtherUserProposalCard component', () => {
    const mockFn = jest.fn();
    const otherUserProposalCard = shallow(<OtherUserProposalCard onClickHandler={mockFn}>Lorem ipsum</OtherUserProposalCard>);

    it('should be defined', () => {
        expect(otherUserProposalCard).toBeDefined();
    });
    it('should render correctly', () => {
        expect(otherUserProposalCard).toMatchSnapshot();
    });
    it('OtherUserProposalCard click event', () => {
        otherUserProposalCard.find(`.${styles.otherUserProposalCard}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
