import React from 'react';
import ProposalRecommendationList from '../../../src/js/components/ui/ProposalRecommendationList/ProposalRecommendationList.js';
import styles from '../../../src/js/components/ui/ProposalRecommendationList/ProposalRecommendationList.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ProposalRecommendationList component', () => {
    const mockFn = jest.fn();
    const proposalrecommendationlist = shallow(<ProposalRecommendationList onClickHandler={mockFn}>Lorem ipsum</ProposalRecommendationList>);

    it('should be defined', () => {
        expect(proposalrecommendationlist).toBeDefined();
    });
    it('should render correctly', () => {
        expect(proposalrecommendationlist).toMatchSnapshot();
    });
    it('ProposalRecommendationList click event', () => {
        proposalrecommendationlist.find(`.${styles.proposalrecommendationlist}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
