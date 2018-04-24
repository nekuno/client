import ActionTypes from '../constants/ActionTypes';
import { waitFor } from '../dispatcher/Dispatcher';
import BaseStore from './BaseStore';
import ChatMessageStore from './ChatMessageStore';

class ChatThreadStore extends BaseStore {

    setInitial() {
        this._threads = [];
        this._offset = 0;
        this._limit = 10;
        this._loading = true;
        this._noMoreMessages = false;
    }

    _registerToActions(action) {

        waitFor([ChatMessageStore.dispatchToken]);

        super._registerToActions(action);
        switch (action.type) {

            case ActionTypes.CHAT_MARK_AS_READED:
            case ActionTypes.CHAT_MESSAGES:
                this._addThreads(ChatMessageStore.getAll());
                this._loading = false;
                this.emitChange();
                break;

            case ActionTypes.CHAT_GET_THREADS_MESSAGES:
                this._offset = action.offset;
                this._limit = action.limit;
                this._loading = true;
                this.emitChange();
                break;

            case ActionTypes.CHAT_NO_MESSAGES:
                this._loading = false;
                this._noMoreMessages = true;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    _addThreads(messages) {

        let threads = {};

        Object.keys(messages).forEach(messageId => {
            let message = messages[messageId];
            let user = message.user.id === message.user_from.id ? message.user_to : message.user_from;
            if (!threads[user.id]) {
                threads[user.id] = {message, user};
            } else {
                if (threads[user.id].message.createdAt < message.createdAt) {
                    threads[user.id] = {message, user};
                }
            }
        });

        this._threads = [];
        Object.keys(threads).forEach(id => {
            this._threads.push(threads[id]);
        });

        this._threads.sort((a, b) => {
            if (a.message.createdAt < b.message.createdAt) {
                return 1;
            } else if (a.message.createdAt > b.message.createdAt) {
                return -1;
            }
            return 0;
        });

        this._offset = this._threads.length;
    }

    getThreads() {
        return this._threads;
    }

    getOffset() {
        return this._offset;
    }

    getLimit() {
        return this._limit;
    }

    getLoading() {
        return this._loading;
    }

    getNoMoreMessages() {
        return this._noMoreMessages;
    }

    hasUnread() {
        return this._threads.some(thread => thread.message && thread.message.user.id === thread.message.user_to.id && thread.message.readed != true);
    }

    getUnreadCount() {
        const unReadMessages = this._threads.filter(thread => thread.message && thread.message.user.id === thread.message.user_to.id && thread.message.readed != true);
        return unReadMessages.length;
    }

}

export default new ChatThreadStore();