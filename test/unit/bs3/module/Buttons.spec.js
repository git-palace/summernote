/**
 * Buttons.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'jquery',
  'summernote/base/core/agent',
  'summernote/base/core/range',
  'summernote/base/Context'
], function (chai, $, agent, range, Context) {
  'use strict';

  var expect = chai.expect;

  // [workaround]
  //  - IE8~11 can't create range in headless mode
  if (agent.isMSIE) {
    return;
  }

  describe('Buttons', function () {
    var context, $toolbar, $editable;

    beforeEach(function () {
      var $note = $('<div><p>hello</p></div>').appendTo('body');

      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($note, options);
      context.initialize();

      $toolbar = context.layoutInfo.toolbar;
      $editable = context.layoutInfo.editable;
    });

    describe('bold button', function () {
      it('should execute bold command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-btn-bold').click();
        expect($editable.html()).to.equalsIgnoreCase('<p><b>hello</b></p>');
      });
    });

    describe('recent color button', function () {
      it('should execute color command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-current-color-button').click();

        var $span = $editable.find('span');
        expect($span).to.be.equalsStyle('#FFFF00', 'background-color');
      });
    });

    describe('fore color button', function () {
      it('should execute fore color command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        var $button = $toolbar.find('[data-event=foreColor]').eq(10);
        $button.click();

        var $font = $editable.find('font');
        expect($font).to.be.equalsStyle($button.data('value'), 'color');
      });
    });

    describe('back color button', function () {
      it('should execute back color command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        var $button = $toolbar.find('[data-event=backColor]').eq(10);
        $button.click();

        var $span = $editable.find('span');
        expect($span).to.be.equalsStyle($button.data('value'), 'background-color');
      });
    });
  });
});
