import { dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import NotificationService from '../services/NotificationService';

export default {

    notify: (category, data) => {
        NotificationService.notify(category, data);
        dispatch(ActionTypes.NOTIFICATION_RECEIVED, {category, data});
    }
}
