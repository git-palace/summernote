define([
  'jquery',
  'summernote/base/core/func',
  'summernote/base/core/list'
], function ($, func, list) {

  /**
   * @class Summernote
   * @param {jQuery} $note
   * @param {Object} options
   * @return {Summernote}
   */
  var Summernote = function ($note, options) {
    var self = this;

    var ui = $.summernote.ui;
    this.modules = {};
    this.buttons = {};
    this.layoutInfo = {};
    this.options = options;

    this.initialize = function () {
      this.layoutInfo = ui.createLayout($note);

      Object.keys(this.options.buttons).forEach(function (key) {
        var button = self.options.buttons[key];
        self.addButton(key, button);
      });

      Object.keys(this.options.modules).forEach(function (key) {
        var module = new self.options.modules[key](self);
        if (module.initialize) {
          module.initialize.apply(module);
        }
        self.addModule(key, module);
      });
      $note.hide();

      this.triggerEvent('ready');
      return this;
    };

    this.destroy = function () {
      Object.keys(this.modules).forEach(function (key) {
        self.removeModule(key);
      });

      ui.removeLayout($note, this.layoutInfo);
    };

    this.triggerEvent = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
      if (callback) {
        callback.apply($note[0], args);
      }
      $note.trigger('summernote.' + namespace, args);
    };

    this.removeLayout = function ($note) {
      $note.editor.remove();
    };

    this.addModule = function (key, instance) {
      this.modules[key] = instance;
    };

    this.removeModule = function (key) {
      if (this.modules[key].destroy) {
        this.modules[key].destroy();
      }
      delete this.modules[key];
    };

    this.addButton = function (key, createHandler) {
      this.buttons[key] = createHandler;
    };

    this.removeButton = function (key) {
      if (this.buttons[key].destroy) {
        this.buttons[key].destroy();
      }
      delete this.buttons[key];
    };

    this.generateButtons = function ($container, buttonArray) {
      buttonArray = buttonArray || [];

      for (var groupIndex = 0, groupLength = buttonArray.length; groupIndex < groupLength; groupIndex++) {
        var group = buttonArray[groupIndex];
        var groupName = group[0];
        var buttonList = group[1];

        var $groupElement = ui.buttonGroup().render();
        $groupElement.addClass('note-' + groupName);

        for (var buttonIndex = 0, buttonLength = buttonList.length; buttonIndex < buttonLength; buttonIndex++) {
          var buttonName = buttonList[buttonIndex];
          var button = this.buttons[buttonName];

          if (button) {
            $groupElement.append(typeof button === 'function' ? button.call(this, this) : button);
          }

        }
        $container.append($groupElement);
      }

    };

    this.createInvokeHandler = function (namespace, value) {
      return function (event) {
        event.preventDefault();
        self.invoke(namespace, value || $(event.target).data('value') || $(event.currentTarget).data('value'));
      };
    };

    this.invoke = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var splits = namespace.split('.');
      var hasSeparator = splits.length > 1;
      var moduleName = hasSeparator && list.head(splits);
      var methodName = hasSeparator ? list.last(splits) : list.head(splits);

      var module = this.modules[moduleName];
      if (module && module[methodName]) {
        return module[methodName].apply(module, args);
      } else if (this[methodName]) {
        return this[methodName].apply(this, args);
      }
    };

    return this.initialize();
  };

  $.summernote = $.summernote || { lang: {} };

  $.fn.extend({
    /**
     * Summernote API
     *
     * @param {Object|String}
     * @return {this}
     */
    summernote: function () {
      var type = $.type(list.head(arguments));
      var isExternalAPICalled = type === 'string';
      var hasInitOptions = type === 'object';

      var options = hasInitOptions ? list.head(arguments) : {};

      options = $.extend({}, $.summernote.options, options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

      this.each(function (idx, note) {
        var $note = $(note);
        if (!$note.data('summernote')) {
          $note.data('summernote', new Summernote($note, options));
        }
      });

      var $note = this.first();
      if (isExternalAPICalled && $note.length) {
        var namespace = list.head(arguments);
        var params = list.tail(list.from(arguments));
        var summernote = $note.data('summernote');
        summernote.invoke(namespace, params);
      }
    }
  });
});
