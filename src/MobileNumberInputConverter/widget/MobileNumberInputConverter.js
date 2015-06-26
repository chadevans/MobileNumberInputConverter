/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery */
/*mendix */
/*
    MobileNumberInputConverter
    ========================

    @file      : MobileNumberInputConverter.js
    @version   : 0.1
    @author    : Chad Evans
    @date      : Fri, 26 Jun 2015 17:07:23 GMT
    @copyright : 2015 Mendix B.v.
    @license   : Apache v2

    Documentation
    ========================
    Converts number inputs on mobile devices to show the numeric keypad.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/dom-style',
    'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text', 'dojo/html', 'dojo/_base/event',
    'dojo/text!MobileNumberInputConverter/widget/template/MobileNumberInputConverter.html'
], function (declare, _WidgetBase, _TemplatedMixin,
    dom, dojoDom, domQuery, domProp, domAttr, domClass, domStyle,
    domConstruct, dojoArray, lang, text, html, event,
    widgetTemplate) {
    'use strict';

    // Declare widget's prototype.
    return declare('MobileNumberInputConverter.widget.MobileNumberInputConverter', [_WidgetBase, _TemplatedMixin], {

        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        inputStyle: "",
        inputClass: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');

            this._updateRendering();
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {},

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {},

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {},

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {},

        // Rerender the interface.
        _updateRendering: function () {
            if (this._contextObj !== null) {
                var inputStyle = this.inputStyle,
                    inputSelector;
                domStyle.set(this.domNode, 'display', 'block');

                if (this.inputClass && this.inputClass !== '') {
                    inputSelector = 'div.' + this.inputClass + '[widgetid^=mxui_widget_NumberInput] > input[type=text]';
                } else {
                    inputSelector = 'div[widgetid^=mxui_widget_NumberInput] > input[type=text]';
                }
                domQuery(inputSelector).forEach(function (value, index) {
                    if (inputStyle === 'keypad') {
                        //domAttr.set(value, 'pattern', '\d*');
                        domAttr.set(value, 'pattern', '[0-9]*');
                    } else if (inputStyle === 'telephone') {
                        domAttr.set(value, 'type', 'tel');
                    } else {
                        domAttr.set(value, 'type', 'number');
                    }
                });
            } else {
                domStyle.set(this.domNode, 'display', 'none');
            }
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            var _objectHandle = null,
                _attrHandle = null;

            // Release handles on previous object, if any.
            if (this._handles) {
                this._handles.forEach(function (handle, i) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions. 
            if (this._contextObj) {

                _objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: lang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                });

                _attrHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.backgroundColor,
                    callback: lang.hitch(this, function (guid, attr, attrValue) {
                        this._updateRendering();
                    })
                });

                this._handles = [_objectHandle, _attrHandle];
            }
        }
    });
});
require(['MobileNumberInputConverter/widget/MobileNumberInputConverter'], function () {
    'use strict';
});