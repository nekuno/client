import 'framework7';
import 'Framework7-3D-Panels/dist/framework7.3dpanels';

class Framework7Service {

    constructor() {
        this._nekunoApp = {};
        this._$$ = {};
    }

    init() {
        this._nekunoApp = new Framework7({
            cache: false,
            router: false,
            swipeBackPage: false
        });
        this._$$ = Dom7;
    }

    nekunoApp() {
        return this._nekunoApp
    }

    $$() {
        return this._$$;
    }
}

export default new Framework7Service();