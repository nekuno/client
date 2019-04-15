import React from 'react';
import ProposalFieldsPreview from '../../../src/js/components/ui/ProposalFieldsPreview/ProposalFieldsPreview.js';
import styles from '../../../src/js/components/ui/ProposalFieldsPreview/ProposalFieldsPreview.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ProposalFieldsPreview component', () => {
    const mockFn = jest.fn();
    const proposalfieldspreview = shallow(<ProposalFieldsPreview onClickHandler={mockFn}>Lorem ipsum</ProposalFieldsPreview>);

    it('should be defined', () => {
        expect(proposalfieldspreview).toBeDefined();
    });
    it('should render correctly', () => {
        expect(proposalfieldspreview).toMatchSnapshot();
    });
    it('ProposalFieldsPreview click event', () => {
        proposalfieldspreview.find(`.${styles.proposalfieldspreview}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
