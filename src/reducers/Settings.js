
const SettingsReducer = function (settings, action){
    switch (action.type){
        case 'SETTINGS_UPDATE_STYLE':
            let style = Object.assign({}, settings.style, action.payload);
            return Object.assign({}, settings,{style});
        default:
            return settings
    }
}

export default SettingsReducer