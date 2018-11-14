import React from 'react';
import IconNotification from '../../../src/js/components/ui/IconNotification/IconNotification.js';
import styles from '../../../src/js/components/ui/IconNotification/IconNotification.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test IconNotification component', () => {
    const mockFn = jest.fn();
    const iconNotification = shallow(<IconNotification icon={'notification'} notifications={5} onClickHandler={mockFn}/>);
    const iconNotificationMoreThanNinetynine = shallow(<IconNotification icon={'notification'} notifications={100} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(IconNotification).toBeDefined();
    });
    it('should render correctly', () => {
        expect(iconNotification).toMatchSnapshot();
        expect(iconNotificationMoreThanNinetynine).toMatchSnapshot();
    });
    it('IconNotification click event', () => {
        iconNotification.find(`.${styles.iconNotification}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
