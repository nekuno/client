import ActionTypes from '../constants/ActionTypes';
import { waitFor } from '../dispatcher/Dispatcher';
import BaseStore from './BaseStore';
import ChatMessageStore from './ChatMessageStore';

class ChatThreadStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._threads = [];
    }

    _registerToActions(action) {

        waitFor([ChatMessageStore.dispatchToken]);

        switch (action.type) {

            case ActionTypes.CHAT_MESSAGES:
                this._addThreads(ChatMessageStore.getAll());
                this.emitChange();
                break;

            case ActionTypes.CHAT_NO_MESSAGES:
                this.emitChange();
                break;

            default:
                break;
        }
    }

    _addThreads(messages) {

        let threads = {};

        for (let messageId in messages) {
            let message = messages[messageId];
            let user = message.user.id === message.user_from.id ? message.user_to : message.user_from;
            if (!threads[user.id]) {
                threads[user.id] = {message, user};
            } else {
                if (threads[user.id].message.createdAt < message.createdAt) {
                    threads[user.id] = {message, user};
                }
            }
        }

        this._threads = [];
        for (var id in threads) {
            this._threads.push(threads[id]);
        }

        this._threads.sort((a, b) => {
            if (a.message.createdAt < b.message.createdAt) {
                return 1;
            } else if (a.message.createdAt > b.message.createdAt) {
                return -1;
            }
            return 0;
        });

    }

    getThreads() {
        return this._threads;
    }

}

export default new ChatThreadStore();