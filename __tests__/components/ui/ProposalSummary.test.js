import React from 'react';
import ProposalSummary from '../../../src/js/components/Proposal/ProposalSummary/ProposalSummary.js';
import styles from '../../../src/js/components/Proposal/ProposalSummary/ProposalSummary.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ProposalSummary component', () => {
    const mockFn = jest.fn();
    const proposalsummary = shallow(<ProposalSummary onClickHandler={mockFn}>Lorem ipsum</ProposalSummary>);

    it('should be defined', () => {
        expect(proposalsummary).toBeDefined();
    });
    it('should render correctly', () => {
        expect(proposalsummary).toMatchSnapshot();
    });
    it('ProposalSummary click event', () => {
        proposalsummary.find(`.${styles.proposalsummary}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
