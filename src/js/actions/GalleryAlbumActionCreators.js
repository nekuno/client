import { dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import ConnectActionCreators from '../actions/ConnectActionCreators';

export default {

    getAlbums: (resource, scope) => {
        return hello(resource).login({scope: scope}).then(function(response) {
            var accessToken = response.authResponse.access_token;
            console.log('accessToken:', accessToken);
            hello(resource).api('me').then(function(status) {
                var resourceId = status.id.toString();
                hello(resource).api('me/albums').then(function(status) {
                    dispatch(ActionTypes.REQUEST_ALBUMS_SUCCESS, {
                        response: {
                            resource: resource,
                            scope: scope,
                            items: status.data
                        }
                    });
                    return ConnectActionCreators.connect(resource, accessToken, resourceId);
                });
            });
        }, (error) => {
            nekunoApp.alert(error.error);
            return dispatch(ActionTypes.REQUEST_ALBUMS_ERROR, {
                response : {
                    resource: resource
                }
            });
        });
    },

    getAlbum: (data, resource, scope) => {
        return hello(resource).login({scope: scope}).then(function(response) {
            var accessToken = response.authResponse.access_token;
            console.log('accessToken:', accessToken);
            hello(resource).api('me/album', 'GET', {id: data.id}).then(function(status) {
                return dispatch(ActionTypes.REQUEST_ALBUM_SUCCESS, {
                    response : {
                        id: data.id,
                        name: data.name,
                        resource: resource,
                        scope: scope,
                        items: status.data
                    }
                });
            });
        }, (error) => {
            nekunoApp.alert(error.error);
            return dispatch(ActionTypes.REQUEST_ALBUM_ERROR, {
                response : {
                    resource: resource
                }
            });
        });
    }
}
