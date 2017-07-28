export const INFINITE_CALENDAR_LOCALE_EN = {
    name: 'en',
    locale: require('date-fns/locale/en'),
    headerFormat: 'ddd, MMM Do',
    weekdays: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    blank: 'Select a date...',
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
    selectionColor: '#6342b1',
    todayColor: '#151232',
    weekdayColor: '#8262a1',
    headerColor: '#6342b1',
    floatingNav: {
        background: 'rgba(99, 66, 177, 0.9)',
        color: '#FFF',
        chevron: '#FFA726'
    }
};