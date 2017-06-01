import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import NotificationService from '../services/NotificationService';
import {sendSubscription, deleteSubscription} from '../api/PushNotificationsAPI';

export default {

    notify: (data) => {
        NotificationService.notify(data);
        dispatch(ActionTypes.NOTIFICATION_NEW, {data});
    },

    subscribe: (subscription) => {
        return dispatchAsync(sendSubscription(subscription), {
            request: ActionTypes.SEND_PUSH_NOTIFICATIONS_SUBSCRIPTION,
            success: ActionTypes.SEND_PUSH_NOTIFICATIONS_SUBSCRIPTION_SUCCESS,
            failure: ActionTypes.SEND_PUSH_NOTIFICATIONS_SUBSCRIPTION_ERROR
        }, {subscription});
    },

    unSubscribe: (subscription) => {
        return dispatchAsync(deleteSubscription(subscription), {
            request: ActionTypes.DELETE_PUSH_NOTIFICATIONS_SUBSCRIPTION,
            success: ActionTypes.DELETE_PUSH_NOTIFICATIONS_SUBSCRIPTION_SUCCESS,
            failure: ActionTypes.DELETE_PUSH_NOTIFICATIONS_SUBSCRIPTION_ERROR
        }, {subscription});
    }
}
