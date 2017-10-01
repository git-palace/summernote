import $ from 'jquery';
import agent from '../core/agent';
import list from '../core/list';
import dom from '../core/dom';

export default function (context) {
  var self = this;
  var ui = $.summernote.ui;

  var options = context.options;

  this.events = {
    'summernote.mousedown': function (we, e) {
      self.update(e.target);
    },
    'summernote.keyup summernote.scroll summernote.change': function () {
      self.update();
    },
    'summernote.disable': function () {
      self.hide();
    }
  };

  this.shouldInitialize = function () {
    return !list.isEmpty(options.popover.table);
  };

  this.initialize = function () {
    this.$popover = ui.popover({
      className: 'note-table-popover'
    }).render().appendTo(options.container);
    var $content = this.$popover.find('.popover-content,.note-popover-content');

    context.invoke('buttons.build', $content, options.popover.table);

    // [workaround] Disable Firefox's default table editor
    if (agent.isFF) {
      document.execCommand('enableInlineTableEditing', false, false);
    }
  };

  this.destroy = function () {
    this.$popover.remove();
  };

  this.update = function (target) {
    if (context.isDisabled()) {
      return false;
    }

    var isCell = dom.isCell(target);

    if (isCell) {
      var pos = dom.posFromPlaceholder(target);
      this.$popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top
      });
    } else {
      this.hide();
    }

    return isCell;
  };

  this.hide = function () {
    this.$popover.hide();
  };
}
