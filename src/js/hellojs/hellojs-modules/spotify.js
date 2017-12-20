(function(hello) {

    hello.init({

        spotify: {
            name: 'spotify',

            oauth: {
                version: '2.0',
                auth   : 'https://accounts.spotify.com/authorize',
                grant  : 'https://accounts.spotify.com/api/token'
            },

            base       : 'https://api.spotify.com/v1/',
            scope_delim: ' ',
            scope      : {
                email        : 'email',
                playlists    : 'playlist-read-private',
                subscriptions: 'user-read-private'
            },

            get: {
                me: 'me'
            },

            wrap: {
                me: function(o) {
                    o.picture = o.images.length ? o.images[0].url : null;
                    o.username = typeof o.id !== 'undefined' ? o.id : null;
                    o.birthday = typeof o.birthdate !== 'undefined' ? o.birthdate : null;
                    return o;
                }
            }
        }
    });

})(hello);