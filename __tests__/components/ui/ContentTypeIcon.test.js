import React from 'react';
import ContentTypeIcon from '../../../src/js/components/ui/ContentTypeIcon/ContentTypeIcon.js';
import styles from '../../../src/js/components/ui/ContentTypeIcon/ContentTypeIcon.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ContentTypeIcon component', () => {
    const mockFn = jest.fn();
    const contenttypeicon = shallow(<ContentTypeIcon onClickHandler={mockFn}>Lorem ipsum</ContentTypeIcon>);

    it('should be defined', () => {
        expect(contenttypeicon).toBeDefined();
    });
    it('should render correctly', () => {
        expect(contenttypeicon).toMatchSnapshot();
    });
    it('ContentTypeIcon click event', () => {
        contenttypeicon.find(`.${styles.contenttypeicon}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
