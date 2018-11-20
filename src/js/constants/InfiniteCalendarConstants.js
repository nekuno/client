export const INFINITE_CALENDAR_LOCALE_EN = {
    name: 'en',
    locale: require('date-fns/locale/en'),
    headerFormat: 'ddd, MMM Do',
    weekdays: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    blank: 'Select a date...',
    from: 'From',
    to: 'to',
    todayLabel: {
        long: 'Today'
    },
    weekStartsOn: 0
};

export const INFINITE_CALENDAR_LOCALE_ES = {
    name: 'es',
    locale: require('date-fns/locale/es'),
    headerFormat: 'ddd, D MMM',
    weekdays: ["Dom","Lun","Mar","Mié","Jue","Vie","Sab"],
    blank: 'Selecciona una fecha...',
    from: 'Del',
    to: 'al',
    todayLabel: {
        long: 'Hoy'
    },
    weekStartsOn: 1
};

export const INFINITE_CALENDAR_THEME = {
    textColor: {
        default: '#333',
        active: '#FFF'
    },
    selectionColor: '#756EE5',
    todayColor: '#756EE5',
    weekdayColor: '#928BFF',
    headerColor: '#756EE5',
    accentColor: '#756EE5',
    floatingNav: {
        background: 'rgba(99, 66, 177, 0.9)',
        color: '#FFF',
        chevron: '#FFA726'
    }
};

export const INFINITE_CALENDAR_BLUE_THEME = {
    textColor: {
        default: '#333',
        active: '#FFF'
    },
    selectionColor: '#63CAFF',
    todayColor: '#63CAFF',
    weekdayColor: '#8ed9ff',
    headerColor: '#63CAFF',
    accentColor: '#63CAFF',
    floatingNav: {
        background: 'rgba(99, 66, 177, 0.9)',
        color: '#FFF',
        chevron: '#FFA726'
    }
};

export const INFINITE_CALENDAR_PINK_THEME = {
    textColor: {
        default: '#333',
        active: '#FFF'
    },
    selectionColor: '#D380D3',
    todayColor: '#D380D3',
    weekdayColor: '#edcced',
    headerColor: '#D380D3',
    accentColor: '#D380D3',
    floatingNav: {
        background: 'rgba(99, 66, 177, 0.9)',
        color: '#FFF',
        chevron: '#FFA726'
    }
};