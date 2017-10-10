/*!BEGIN_HOTKEYLOCALCONTEXT_JS*/
/*jslint plusplus: true, nomen: true */
/*global dojo, mx, mxui, define, require, browser, devel, console, document, jQuery, Hotkey, Syn */

/*!
 Hotkey Widget
 ========================
 
 @file      : HotkeyLocalContext.js
 @version   : 2.0.1
 @author    : Georg Holtz / Nick van Wieren
 @date      : Thu, 31 Mar 2016 10:03:00 GMT+0200
 @copyright : Mansystems
 @license   : Apache-2.0
 
 Documentation 
 ========================
 The Hotkey Widget allows to define hotkeys (i.e. keyboard shortcuts) for your application.
 This is the local widget which allows you to define form specific hotkeys.

 */

define([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dojo/topic'
], function (declare, _WidgetBase) {
    'use strict';

    // Declare widget's prototype.
    return declare('Hotkey.widget.HotkeyLocalContext', [_WidgetBase], {
        hotkeyLocalCategory: "",
        hotkeyName: "",
        hotkeyDescription: "",
        metaKey: "",
        plainKey: "",
        allowModal: "",
        actionType: "",
        microflow: "",
        mendixAction: "",
        elementSelector: "",
        hotkeyList: null,
        postCreate: function () {
            "use strict";
 
            // parse config
            var hotkeyNameArr = this.hotkeyName.split(";"),
                    hotkeyDescriptionArr = this.hotkeyDescription.split(";"),
                    metaKeyArr = this.metaKey.split(";"),
                    plainKeyArr = this.plainKey.split(";"),
                    allowModalArr = this.allowModal.split(";"),
                    actionTypeArr = this.actionType.split(";"),
                    microflowArr = this.microflow.split(";"),
                    mendixActionArr = this.mendixAction.split(";"),
                    elementSelectorArr = this.elementSelector.split(";"),
                    i,
                    hotkeyObj;
            if (!this.hotkeyList) {
                // create list of hotkey objects
                this.hotkeyList = [];
                for (i = 0; i < hotkeyNameArr.length; i++) {
                    hotkeyObj = {
                        hotkeyName: hotkeyNameArr[i],
                        hotkeyDescription: hotkeyDescriptionArr[i],
                        metaKey: metaKeyArr[i],
                        plainKey: plainKeyArr[i],
                        allowModal: (allowModalArr[i] === "true") ? true : false,
                        actionType: actionTypeArr[i],
                        microflow: microflowArr[i],
                        mendixAction: mendixActionArr[i],
                        elementSelector: elementSelectorArr[i]
                    };
                    this.hotkeyList.push(hotkeyObj);
                }
            }

            // trigger reload of local hotkey list
            dojo.publish("hotkey/add", [this.id]);

            // widget rendering finished
            this.actLoaded();
        },
        suspend: function () {
            "use strict";
            // trigger refresh of local hotkey list
            dojo.publish("hotkey/remove", [this.id]);
        },
        resume: function () {
            "use strict";
            // trigger refresh of local hotkey list
            dojo.publish("hotkey/add", [this.id]);
        },
        uninitialize: function () {
            "use strict";
            // always unload local widgets
            // trigger reload of local hotkey list
            dojo.publish("hotkey/remove", [this.id]);
        }
    });
});
require(['Hotkey/widget/HotkeyLocalContext'], function () {
    'use strict';
});