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
    
    // La inicialización se hace cuando aún no existe el HTML del panel
    // por tanto swipePanel y otros no funcionan. Como hack un poco cutre,
    // esperaremos a que se monte el HTML y volveremos a llamar al método
    // interno que inicializa el swipe
    reinitialize() {
        this._nekunoApp.initSwipePanels();
    }


    nekunoApp() {
        return this._nekunoApp
    }

    $$() {
        return this._$$;
    }
    
    alertLoginFailed(resource, status) {
        this.nekunoApp().alert(`Ha fallado el login con ${resource} (${ststus.error.message})`)
    }
    
}

export default new Framework7Service();