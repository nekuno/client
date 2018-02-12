import Bluebird from 'bluebird';
import request from 'request';

import { GOOGLE_KNOWLEDGE_GRAPH_URL } from '../constants/Constants';

class TagSuggestionService {

    requestGoogleTag(query, languages, types, limit = 10) {
        return new Bluebird((resolve, reject) => {
            const url = this.buildUrl(query, languages, types, limit);

            request(url, (error, response, body) => {
                if (error){
                    return reject(error);
                }
                if (response.statusCode >= 400) {
                    return reject(body);
                }
                return resolve(body);
            })
        })
    }

    buildUrl(query, languages = [], types = [], limit)
    {
        let url = GOOGLE_KNOWLEDGE_GRAPH_URL;

        url += '&query=' + query;

        url += '&limit=' + limit;

        if (languages.length > 0){
            languages = languages.join();
            url += '&languages=' + languages;
        }

        url += '&prefix=true';

        // if (types.length > 0){
        //     types = types.join();
        //     url += '&types=' + types;
        // }

        return url;
    }
}

export default new TagSuggestionService();
