/*!BEGIN_HOTKEY_JS*/
/*jslint plusplus: true, nomen: true */
/*global dojo, mx, mxui, define, require, browser, devel, console, document, jQuery, Hotkey, Syn */

/*!
 Hotkey Widget
 ========================
 
 @file      : Hotkey.js
 @version   : 2.0.1
 @author    : Georg Holtz / Nick van Wieren
 @date      : Thu, 31 Mar 2016 10:03:00 GMT+0200
 @copyright : Mansystems
 @license   : Apache-2.0
 
 Documentation 
 ========================
 The Hotkey Widget allows to define hotkeys (i.e. keyboard shortcuts) for your application.
 This is the global widget that should be loaded once like the feedback widget.

 Changes
	- 2016-03-25 Fixed IE11 opening default help when using F1 as hotkey
	
 TODOs
	- Fix Mx5 history back/forward calls (screen.back/forward deprecated)
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dijit/_base/manager', 'dijit/WidgetSet',
    'Hotkey/lib/jquery-1.11.2', 'Hotkey/lib/jqueryselectors', 'Hotkey/lib/syn', "dojo/topic", "dijit/registry"
], function (declare, _WidgetBase, dom, dojoDom, domQuery, domStyle, domConstruct, dojoArray, lang, dijit, WidgetSet, _jQuery, _selectors, _syn, topic, registry) {
    'use strict';

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare('Hotkey.widget.Hotkey', [_WidgetBase], {
        // Parameters configured in the Modeler.
        hotkeyName: "",
        hotkeyDescription: "",
        metaKey: "",
        plainKey: "",
        allowModal: "",
        actionType: "",
        microflow: "",
        mendixAction: "",
        elementSelector: "",
        hotkeyGlobalCategory: "",
        disableForInputFields: true,
        suppressFurtherEventProcessing: true,
        showHotkeyList: true,
        placingHotkeyList: "",
        openHotkeyListAction: "",
        hotkeyList: null,
        hackNativeDialogShortcut: false,
        // local variables
        localWidgets: new WidgetSet(),
        hotkeyDocNodes: [],
        currentContext: null,
        _underlayWidgetClasses: ["mxui.widget.Underlay", "dijit.DialogUnderlay"],
        _modalsWidgetClasses: ["mxui.widget.Window", "mxui.widget.DialogMessage", "mxui.widget.Confirmation", "mxui.widget.MxWindow", "mxui.widget.Dialog"],
        _contextClassesString: ".mx-window, .mx-dialog, #content, .mendixDialog, .mendixWindow, #mainbox",
        _defaultContextClassesString: '#content, #mainbox',
        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        
        postCreate: function () {
            "use strict";
            console.log(this.id + '.postCreate');            

            // check if there is already another global widget loaded
            if (Hotkey.widget.globalLoaded !== true) {
                // set flag that global widget is loaded now
                Hotkey.widget.globalLoaded = true;
 
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

                // connect key events
                $(document).keydown($.proxy(this._handleKeypress, this));

                // allow mxwindows and content manager to be focusable
                // otherwise we cannot always determine the context reliably
                // do it on mouseenter, because there is no oncreate
                // TODO: use aspects for windows/dialogs, set for content only on start
                $(document).on("mouseenter", this._contextClassesString, function (event) {
                    if (!$(this).attr("tabindex")) {
                        // makes it focusable
                        $(this).attr("tabindex", "-1");
                        // remove ugly dotted line
                        $(this).css("outline", "0");
                    }
                    // $(this).css("-moz-user-focus", "normal");
                });

                // hack 1: disable native dialog shortcuts
                if (this.hackNativeDialogShortcut) {
                    if (mxui.widget.DialogMessage) {
                        mxui.widget.DialogMessage.prototype.onFocusPress = function () {
                            return;
                        };
                    } else if (mxui.widget.Dialog) {
                        mxui.widget.Dialog.prototype.onFocusPress = function () {
                            return;
                        };
                    }
                }
				
				// hack 2: prevent IE11 help function if F1 is used as hotkey
				if (!!window.MSInputMethodContext && !!document.documentMode) {					
					for (i = 0; i < this.hotkeyList.length; i++) {
						if (this.hotkeyList[i].plainKey == "_112") {
							if ("onhelp" in window) window.onhelp = function() { return false; }
						}
					}
				}
				
                // subscribe to add/remove event from local widgets                
                dojo.subscribe("hotkey/add", this, this._addLocalWidget);
                dojo.subscribe("hotkey/remove", this, this._removeLocalWidget);
 
                // insert css
                if (this.showHotkeyList) {
                    // load css
                    dom.addCss(require.toUrl("Hotkey/widget/ui/Hotkey.css"));
                }

                // initialize local widgets
                // get all instances of local hotkey widget
                dijit.registry.filter(function (w) {
                    return (w.declaredClass === "Hotkey.widget.HotkeyLocal") ||
                            (w.declaredClass === "Hotkey.widget.HotkeyLocalContext");
                }).forEach(function (widget) {
                    this.localWidgets.add(widget);
                });

                // refresh hotkey doc nodes
                if (this.showHotkeyList && this.localWidgets) {
                    // refresh documentation
                    this._refreshHotkeyDocNodes();
                }
             }
             // widget rendering finished
             this.actLoaded();
        },

        // custom functions
        _arrContains: function (array, object) {
            "use strict";
            return array.indexOf(object) !== -1;
        },
        _handleKeypress: function (event) {
            "use strict";
            var inputFields = ["input", "iframe", "textarea"],
                    success = false;

            // cancel hotkey handling if target dom element of event was destroyed
            // this happens for example with ESC and close dialog, because Mendix also has this as internal shortcut
            if (!dojoDom.isDescendant(event.target || event.srcElement, document)) {
                console.log("target element is destroyed, nothing to do here");
                return;
            }

            // do nothing if focus is in input field and option is enabled
            // also stop further handling of event
            if (this.disableForInputFields && inputFields.indexOf(document.activeElement.tagName.toLowerCase()) !== -1) {
                /*                if (this.suppressFurtherEventProcessing) {
                 this._stopEventProcessing(event);
                 }*/
                return;
            }

            // determine current context
            this.currentContext = this._getCurrentContext(event);

            // cancel hotkey handling if context is unknown
            if (!this.currentContext) {
                console.log("unknown context");
                return;
            }

            // check if event target is within context (could help with ESC/dialog issue) 
            /*        if (!dojo.isDescendant(event.target, this.currentContext)) {
             return;
             }*/

            // check matching for all hotkeys and skip after first match
            // (1) local hotkeys
            if (this.localWidgets) {
                this.localWidgets.filter(function (w) {
                    // get the widgets which are not suspended and in context
                    return !w.get('suspended') && dojoDom.isDescendant(w.domNode, this.currentContext);
                }, this).some(function (widget) {
                    success = this._matchHotkeyList(widget.hotkeyList, event, widget.mxcontext);
                    return success;
                }, this);
            }

            // (2) global hotkeys
            if (!success) {
                success = this._matchHotkeyList(this.hotkeyList, event);
            }

            // stop event if hotkey was executed and option is set
            if (success) {
                this._stopEventProcessing(event);
            }
        },
        _matchHotkeyList: function (list, event, mxcontext) {
            "use strict";
            return dojoArray.some(list, function (hotkey) {
                //console.log("hotkey: " + hotkey.hotkeyName);
                //console.log("event: " + event.metaKey + " / " + event.plainKey);
                return this._matchHotkey(hotkey, event, mxcontext);
            }, this);
        },
        // this function checks the matching of a defined hotkey
        // with the actual pressed keys and triggers the microflow on match
        _matchHotkey: function (hotkey, event, mxcontext) {
            "use strict";
            var metaKeyMatch = false,
                    plainKeyMatch = false;

            // check meta key match
            switch (hotkey.metaKey) {
                case "NONE":
                    if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "CTRL":
                    if (event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "ALT":
                    if (!event.ctrlKey && event.altKey && !event.shiftKey && !event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "SHIFT":
                    if (!event.ctrlKey && !event.altKey && event.shiftKey && !event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "META":
                    if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "CTRL_ALT":
                    if (event.ctrlKey && event.altKey && !event.shiftKey && !event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "CTRL_SHIFT":
                    if (event.ctrlKey && !event.altKey && event.shiftKey && !event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "CTRL_META":
                    if (event.ctrlKey && !event.altKey && !event.shiftKey && event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "ALT_SHIFT":
                    if (!event.ctrlKey && event.altKey && event.shiftKey && !event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "ALT_META":
                    if (!event.ctrlKey && event.altKey && !event.shiftKey && event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                case "SHIFT_META":
                    if (!event.ctrlKey && !event.altKey && event.shiftKey && event.metaKey) {
                        metaKeyMatch = true;
                    }
                    break;
                default:
                    break;
            }

            // return false if meta key matching failed
            if (!metaKeyMatch) {
                return false;
            }

            // check plain key match
            if (event.which && hotkey.plainKey === '_' + event.which) {
                plainKeyMatch = true;
            }

            // return if plain key matching failed
            if (!plainKeyMatch) {
                return false;
            }

            // if we are here, the meta keys and plain key both matched
            // --> trigger action
            switch (hotkey.actionType) {
                case "MICROFLOW":
                    // check if modal is allowed
                    if (hotkey.microflow !== '' && (hotkey.allowModal || !this._modalUnderlayVisible())) {
                        this._triggerMicroflow(hotkey.microflow, mxcontext);
                    } //else console.log('Hotkey widget: no microflow defined for this hotkey.');
                    break;
                case "MENDIX":
                    // check if modal is allowed
                    if (hotkey.mendixAction !== '' && (hotkey.allowModal || !this._modalUnderlayVisible())) {
                        this._performMendixAction(hotkey.mendixAction);
                    } //else console.log('Hotkey widget: no mendix action defined for this hotkey.');
                    break;
                case "CLICK":
                    if (hotkey.elementSelector !== '' && this.currentContext) {
                        this._clickElement(hotkey.elementSelector, this.currentContext);
                    } //else console.log('Hotkey widget: no element selector defined for this hotkey.');
                    break;
                default:
                    break;
            }
            return true;
        },
        _stopEventProcessing: function (event) {
            "use strict";
            if (this.suppressFurtherEventProcessing) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        },
        // add local hotkey widget
        _addLocalWidget: function (widget) {
            "use strict";
            //console.log("add local hotkey widget: " + widget);
            if (this.localWidgets) {
                this.localWidgets.add(dijit.byId(widget));
            }
            //console.log("local widgets: " + this.localWidgets.length);
            // refresh
            this._refreshHotkeyDocNodes();
        },
        // remove local hotkey widget
        _removeLocalWidget: function (widget) {
            "use strict";
            //console.log("remove local hotkey widget: " + widget);
            this.localWidgets.remove(widget);
            //console.log("local widgets: " + this.localWidgets.length);
            // refresh
            this._refreshHotkeyDocNodes();
        },
        _refreshHotkeyDocNodes: function () {
            "use strict";
            //        console.log("refresh hotkey doc nodes");

            if (this.showHotkeyList) {
                // 1) find nodes to insert documentation
                this.hotkeyDocNodes = domQuery(this.placingHotkeyList);
                if (this.hotkeyDocNodes.length > 0) {
                    this.hotkeyDocNodes.forEach(function (n) {
                        // 1) empty and create table
                        domConstruct.empty(n);
                        var table = domConstruct.create("table", null, n),
                                tbody = domConstruct.create("tbody", null, table);

                        // 2) local widgets
                        // call generate function for each local widget
                        this.localWidgets.forEach(function (w) {
                            // count hotkeys for documentation
                            var count = $.grep(w.hotkeyList, function (a) {
                                return a.showDocumentation;
                            }).length;
                            // only print for non-suspended widgets
                            if (!w.get('suspended') && count > 0) {
                                this._generateTableRows(w.hotkeyList, tbody, w.hotkeyLocalCategory);
                            }
                        }, this);

                        // 3) global widget
                        this._generateTableRows(this.hotkeyList, tbody, this.hotkeyGlobalCategory);
                    }, this);
                }
            }
        },
        _getCharFromKeyCode: function (key) {
            "use strict";
            var keyCode = parseInt(key.substring(1), 10);
            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90)) {
                return String.fromCharCode(keyCode);
            } else if (keyCode === 27) {
                return "Esc";
            } else if (keyCode === 9) {
                return "Tab";
            } else if (keyCode === 13) {
                return "\u23CE";
            } else if (keyCode === 32) {
                return "Space";
            } else if (keyCode === 33) {
                return "Page Up";
            } else if (keyCode === 34) {
                return "Page Down";
            } else if (keyCode === 35) {
                return "End";
            } else if (keyCode === 36) {
                return "Home";
            } else if (keyCode === 45) {
                return "Ins";
            } else if (keyCode === 46) {
                return "Del";
            } else if (keyCode === 8) {
                return "\u232b";
            } else if (keyCode === 37) {
                return "\u2190";
            } else if (keyCode === 38) {
                return "\u2191";
            } else if (keyCode === 39) {
                return "\u2192";
            } else if (keyCode === 40) {
                return "\u2193";
            } else if (keyCode === 91) {
                return "Left Window";
            } else if (keyCode === 93) {
                return "Right Window";
            } else if (keyCode === 96) {
                return "Numpad 0";
            } else if (keyCode === 97) {
                return "Numpad 1";
            } else if (keyCode === 98) {
                return "Numpad 2";
            } else if (keyCode === 99) {
                return "Numpad 3";
            } else if (keyCode === 100) {
                return "Numpad 4";
            } else if (keyCode === 101) {
                return "Numpad 5";
            } else if (keyCode === 102) {
                return "Numpad 6";
            } else if (keyCode === 103) {
                return "Numpad 7";
            } else if (keyCode === 104) {
                return "Numpad 8";
            } else if (keyCode === 105) {
                return "Numpad 9";
            } else if (keyCode === 106) {
                return "Numpad *";
            } else if (keyCode === 107) {
                return "Numpad +";
            } else if (keyCode === 109) {
                return "Numpad -";
            } else if (keyCode === 110) {
                return "Numpad .";
            } else if (keyCode === 111) {
                return "Numpad /";
            } else if (keyCode === 112) {
                return "F1";
            } else if (keyCode === 113) {
                return "F2";
            } else if (keyCode === 114) {
                return "F3";
            } else if (keyCode === 115) {
                return "F4";
            } else if (keyCode === 116) {
                return "F5";
            } else if (keyCode === 117) {
                return "F6";
            } else if (keyCode === 118) {
                return "F7";
            } else if (keyCode === 119) {
                return "F8";
            } else if (keyCode === 120) {
                return "F9";
            } else if (keyCode === 121) {
                return "F10";
            } else if (keyCode === 122) {
                return "F11";
            } else if (keyCode === 123) {
                return "F12";
            }
        },
        _generateTableRows: function (hotkeyList, tableNode, categoryTitle) {
            "use strict";
            // generate header row
            var tr_header = domConstruct.create("tr", {
                className: "hotkeyRowHeader"
            }, tableNode),
                    th_header = domConstruct.create("th", {
                        colspan: "2",
                        className: "hotkeyCellHeader"
                    }, tr_header);
            domConstruct.create("span", {
                className: "hotkeyHeader",
                innerHTML: categoryTitle
            }, th_header);

            // generate a row for every hotkey
            dojoArray.forEach(hotkeyList, function (hotkey, i) {
                //dojo.forEach(hotkeyList, function (hotkey, i) {
                // table row
                var tr = domConstruct.create("tr", {
                    className: ((i % 2) === 0) ? "hotkeyRowEven" : "hotkeyRowOdd"
                }, tableNode),
                        // cell for keys
                        td_keys = domConstruct.create("td", {
                            className: "hotkeyCellKey"
                        }, tr),
                        splitMetaKeys,
                        td_name;

                if (hotkey.metaKey !== "NONE") {
                    if (hotkey.metaKey.indexOf("_") !== -1) {
                        splitMetaKeys = hotkey.metaKey.split("_");
                        domConstruct.create("kbd", {
                            innerHTML: splitMetaKeys[0]
                        }, td_keys);
                        domConstruct.create("span", {
                            innerHTML: " + "
                        }, td_keys);
                        domConstruct.create("kbd", {
                            innerHTML: splitMetaKeys[1]
                        }, td_keys);
                    } else {
                        domConstruct.create("kbd", {
                            innerHTML: hotkey.metaKey
                        }, td_keys);
                    }
                }

                if (hotkey.metaKey !== "NONE" && hotkey.plainKey !== "NONE") {
                    domConstruct.create("span", {
                        innerHTML: " + "
                    }, td_keys);
                }
                if (hotkey.plainKey !== "NONE") {
                    domConstruct.create("kbd", {
                        innerHTML: this._getCharFromKeyCode(hotkey.plainKey)
                    }, td_keys);
                }
                // cell for name and description
                td_name = domConstruct.create("td", {
                    className: "hotkeyCellName"
                }, tr);
                domConstruct.create("span", {
                    className: "hotkeyName",
                    innerHTML: hotkey.hotkeyName
                }, td_name);
                domConstruct.create("span", {
                    className: "hotkeyDescription",
                    innerHTML: hotkey.hotkeyDescription
                }, td_name);
            }, this);
        },
        // returns active underlay widget
        _getActiveUnderlays: function () {
            "use strict";
            return dijit.registry.filter(function (w) {
                // first check classes
                var isMatch = this._arrContains(this._underlayWidgetClasses, w.declaredClass);
                // check css visibility in case _count does not exist (in mx4 there's always only one underlay)
                if (isMatch && w.declaredClass === "mxui.widget.Underlay") { // Mx5
                    isMatch = isMatch && +w._count > 0;
                } else if (isMatch && w.declaredClass === "dijit.DialogUnderlay") { // Mx4
                    isMatch = isMatch && domStyle.get(w.domNode, "display").toLowerCase() !== "none";
                } else {
                    isMatch = false;
                }
                return isMatch;
            }, this);
        },
        // returns true if modal windows are open
        _modalUnderlayVisible: function () {
            "use strict";
            return this._getActiveUnderlays.length > 0;
        },
        // returns site context dom node
        _getCurrentContext: function (event) {
            "use strict";
            var eventTarget = domQuery(event.target || event.srcElement)[0],
                    underlays,
                    underlayZIndex,
                    match,
                    modal,
                    foundContext;

            // 1) check for modals
            // get active underlays
            underlays = this._getActiveUnderlays();

            // there should be exactly one visible underlay
            if (underlays.length === 1) {
                // get active underlays z-index
                underlayZIndex = domStyle.get(underlays.toArray()[0].domNode, "zIndex");
                // get the modal dialog/window on top
                modal = dijit.registry.filter(function (w) {
                    match = true;
                    // only windows and dialogs (match by class)
                    match = match && this._arrContains(this._modalsWidgetClasses, w.declaredClass);
                    // only non-destroyed
                    match = match && !w._destroyed;
                    // filter by modal
                    match = match && (w.modal || w.uiplace === "modal" || (typeof w.modal === "undefined" && typeof w.uiplace === "undefined"));
                    // filter by visibility (this helps to handle dialogs that are closed by mendix via esc)
                    //match = match && (w._visible || w.visible || (typeof w._visible == 'undefined' && typeof w.visible == 'undefined'));
                    // filter out if z-index is below underlay (use + to convert to number)
                    match = match && (+domStyle.get(w.domNode, "zIndex") > +underlayZIndex);
                    return match;
                }, this).toArray()[0];

                if (modal) {
                    return modal.domNode;
                }
            } else {
                // 2) get context based on target element of event
                // get closest parent window/dialog or content element
                foundContext = eventTarget.closest(this._contextClassesString);

                if (foundContext) {
                    return foundContext;
                }
            }

            // 3) return default context
            // if no window is focused, return
            return domQuery(this._defaultContextClassesString);
        },
        // this function triggers the microflow with the given name
        _triggerMicroflow: function (microflowName, mxcontext) {
            "use strict";
            mx.data.action({
                params: {
                    actionname: microflowName
                },
                context: mxcontext,
                error: function () {
                    console.log(this.id + ": An error occurred while executing microflow: " + error.description);
                },
                async: false
            });
        },
        // this function performs a mendix action
        _performMendixAction: function (action) {
            "use strict";
            switch (action) {
                case "REFRESH":
                    // not available in mx5
                    if (typeof this.mxform.reload === "function") {
                        this.mxform.reload();
                    }
                    break;
                case "BACK":
                    // not available in mx5
                    if (typeof mx.ui.back === "function") {
                        mx.ui.back();
                    }
                    break;
                case "FORWARD":
                    // not available in mx5
                    if (typeof window.history.forward === "function") {
                        window.history.forward();
                    }
                    break;
                default:
                    //console.log('Hotkey widget: no mendix action with this name found.');
                    break;
            }
        },
        // this function queries the element by the given selector and performs a click
        _clickElement: function (identifier, context) {
            "use strict";
            var elements = [],
                    arrIdentifiers = [],
                    identifierJSON,
                    filterByAttributes,
                    filterBySelector,
                    filterUndefineds,
                    filterByContext,
                    i,
                    selectorJSON,
                    elements_a,
                    elements_b,
                    elements_c;

            try {
                identifierJSON = JSON.parse(identifier);
                if (identifierJSON instanceof Array) {
                    arrIdentifiers.push.apply(arrIdentifiers, identifierJSON);
                } else {
                    arrIdentifiers.push(identifierJSON);
                }

                // functions for the loop
                filterByAttributes = function (w) {
                    var match = true,
                            f,
                            widgetFilter = selectorJSON.widgetFilter;
                    for (f in widgetFilter) {
                        if (widgetFilter.hasOwnProperty(f)) {
                            match = match && (w[f] === widgetFilter[f]);
                        }
                    }
                    // filter out suspended widgets
                    match = match && !w._suspended;
                    return match;
                };
                filterBySelector = function (w) {
                    if (selectorJSON.selector && selectorJSON.selector !== '') {
                        var s = selectorJSON.selector,
                                d = w.domNode,
                                e = $(s, d);
                        return e[0];
                    } else {
                        return w.domNode;
                    }
                };
                filterUndefineds = function (node) {
                    // filter undefineds
                    return node;
                };
                filterByContext = function (node) {
                    // filter by context
                    return dojoDom.isDescendant(node, context);
                };

                for (i = 0; i < arrIdentifiers.length; ++i) {
                    selectorJSON = arrIdentifiers[i];
                    // if object has widget filter 
                    if (selectorJSON.widgetFilter) {
                        elements_a = dijit.registry.
                                filter(filterByAttributes).
                                map(filterBySelector).
                                filter(filterUndefineds).
                                filter(filterByContext);
                        //elements = elements.concat(elements_a);
                        elements = elements.concat(elements_a);
                    } else if (selectorJSON.selector) {
                        // else only query by selector
                        elements_b = $(selectorJSON.selector, context).toArray();
                        elements = elements.concat(elements_b);
                    }
                }
            } catch (e) {
                // fallback
                elements_c = $(identifier, context).toArray();
                elements = elements.concat(elements_c);
            }

            // filter by visibility
            elements = $(elements).filter(":visible");

            if (elements.length === 1) {
                Syn.click({}, elements[0]);
            }
            //else if (elements.length === 0) console.log('Hotkey widget: no element found for this selector.');
            //else console.log('Hotkey widget: too many target elements found for this selector.');
        }
    });
});

require(['Hotkey/widget/Hotkey'], function () {
    'use strict';
});
/*EOF*/