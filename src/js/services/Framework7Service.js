import 'framework7';

class Framework7Service {

    constructor() {
        this._nekunoApp = {};
        this._$$ = {};
    }

    init() {
        this._nekunoApp = new Framework7({
            cache: false,
            router: false,
            swipeBackPage: false,
            swipePanel: 'left',
            swipePanelActiveArea: 0.25 * document.documentElement.clientWidth,
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