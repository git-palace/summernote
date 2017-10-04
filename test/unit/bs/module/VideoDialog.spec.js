/**
 * VideoDialog.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */

import chai from 'chai';
import $ from 'jquery';
import Context from '../../../../src/js/base/Context';
import VideoDialog from '../../../../src/js/base/module/VideoDialog';

var expect = chai.expect;

describe('bs:module.VideoDialog', () => {

  var context, $video, $toolbar, $editable;

  function expectUrl(source, target) {
    var iframe = $video.createVideoNode(source);
    expect(iframe).to.not.equal(false);
    expect(iframe.tagName).to.equal('IFRAME');
    expect(iframe.src).to.equal(target);
  }

  beforeEach(() => {
    var $note = $('<div></div>').appendTo('body');
    var options = $.extend({}, $.summernote.options);
    options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    options.toolbar = [
      ['video', ['video']]
    ];
    context = new Context($note, options);
    context.initialize();

    $video = new VideoDialog(context);

    $toolbar = context.layoutInfo.toolbar;
    $editable = context.layoutInfo.editable;
  });

  describe('#createVideoNode', () => {
    it('should execute when insert other url', () => {
      expect($video.createVideoNode('http://www.google.com')).to.equal(false);
      expect($video.createVideoNode('http://www.youtube.com')).to.equal(false);
      expect($video.createVideoNode('http://www.facebook.com')).to.equal(false);
    });
    it('should execute when insert v.qq.com', () => {
      expectUrl('http://v.qq.com/cover/6/640ewqy2v071ppd.html?vid=f0196y2b2cx',
        'http://v.qq.com/iframe/player.html?vid=f0196y2b2cx&amp;auto=0');
      expectUrl('http://v.qq.com/x/page/p0330y279lm.html',
        'http://v.qq.com/iframe/player.html?vid=p0330y279lm&amp;auto=0');
    });
  });

});
