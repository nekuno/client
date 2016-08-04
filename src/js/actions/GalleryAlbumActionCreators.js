import { dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import SocialNetworkService from '../services/SocialNetworkService';

export default {

    getAlbums: (resource, scope) => {
        return SocialNetworkService.getDataFromUrl(resource, scope, 'me/albums').then((status) => {
                dispatch(ActionTypes.REQUEST_ALBUMS_SUCCESS, {
                    response: {
                        resource: resource,
                        scope: scope,
                        items: status.data
                    }
                });
        }, (status) => {
            nekunoApp.alert(status.error.code);
            dispatch(ActionTypes.REQUEST_ALBUMS_ERROR, {
                response : {
                    resource: resource
                }
            });
        });
    },

    getAlbum: (data, resource, scope) => {
        return SocialNetworkService.getDataFromUrl(resource, scope, 'me/album', 'GET', {id: data.id}).then((status) => {
            dispatch(ActionTypes.REQUEST_ALBUM_SUCCESS, {
                response: {
                    id: data.id,
                    name: data.name,
                    resource: resource,
                    scope: scope,
                    items: status.data || []
                }
            });
        }, (status) => {
            nekunoApp.alert(status.error.code);
            return dispatch(ActionTypes.REQUEST_ALBUM_ERROR, {
                response : {
                    resource: resource
                }
            });
        });
    }
}
