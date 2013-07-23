/**
 * dom.spec.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
var dom = $.fn.summernoteInner().dom,
    func = $.fn.summernoteInner().func;

test('dom.ancestor', function() {
  var $cont, $b, elB;

  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), elB = $b[0].firstChild;

  equal(dom.ancestor(elB, dom.isB), $b[0], 'find ancestor B');
  equal(dom.ancestor(elB, dom.isDiv), $cont[0], 'find ancestor DIV');

  equal(dom.ancestor(elB, dom.isU), null, 'find ancestor U: null');
});

test('dom.listAncestor', function() {
  var $cont, $b, $u, $s, $i;

  $cont = $('<div><i><s><u><b>b</b></u></s></i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  deepEqual(dom.listAncestor($b[0], function(node) {
    return node === $i[0];
  }), [$b[0], $u[0], $s[0], $i[0]], 'listAncestor from b to i');

  deepEqual(dom.listAncestor($u[0], function(node) {
    return node === $s[0];
  }), [$u[0], $s[0]], 'listAncestor from u to s');

});

test('dom.commonAncestor', function() {
  var $cont, $b, elB;

  $cont = $('<div><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></div>');
  $span = $cont.find('span');
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  equal(dom.commonAncestor($b[0], $u[0]), $span[0], 'common(b, u) => span');
  equal(dom.commonAncestor($b[0], $s[0]), $cont[0], 'common(b, s) => div');
});

test('dom.listBetween', function() {
  var $cont, $b, $u, $s, $i;
  
  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  deepEqual(dom.listBetween($b[0], $b[0]), [$b[0]], 'same elements');
  deepEqual(dom.listBetween($b[0], $u[0]), [$b[0], $b[0].firstChild, $u[0]], 'adjacent');
  deepEqual(dom.listBetween($b[0], $s[0]), [$b[0], $b[0].firstChild,
                                            $u[0], $u[0].firstChild,
                                            $s[0]], 'distance 2');
});

test('dom.listNext', function() {
   var $cont, $b, $u, $s, $i;

  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  deepEqual(dom.listNext($u[0]), [$u[0], $s[0], $i[0]], 'with no pred');
  deepEqual(dom.listNext($i[0]), [$i[0]], 'last item with no pred');
  
  deepEqual(dom.listNext($s[0], func.eq($i[0])), [$s[0], $i[0]], 's to i');
});

test('dom.position', function() {
  var $cont, $b, $u, $s, $i;

  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  equal(dom.position($b[0]), 0, 'should b return zero');
  equal(dom.position($u[0]), 1, 'should u return one');
  equal(dom.position($s[0]), 2, 'should s return three');
  equal(dom.position($i[0]), 3, 'should i return four');

  equal(dom.position($b[0].firstChild), 0, 'should text in b return zero');
});

test('dom.makeOffsetPath', function() {
  var $cont, $b, $u, $s, $i;

  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  deepEqual(dom.makeOffsetPath($cont[0], $cont[0]), [], 'should return empty list');

  deepEqual(dom.makeOffsetPath($cont[0], $b[0]), [0], 'should return [0]');
  deepEqual(dom.makeOffsetPath($cont[0], $b[0].firstChild), [0, 0], 'should return [0, 0]');

  deepEqual(dom.makeOffsetPath($cont[0], $u[0]), [1], 'shuold return [1]');
  deepEqual(dom.makeOffsetPath($cont[0], $u[0].firstChild), [1, 0], 'shuold return [1, 0]');

  deepEqual(dom.makeOffsetPath($cont[0], $s[0]), [2], 'shuold return [2]');
  deepEqual(dom.makeOffsetPath($cont[0], $s[0].firstChild), [2, 0], 'shuold return [2, 0]');

  deepEqual(dom.makeOffsetPath($cont[0], $i[0]), [3], 'shuold return [3]');
  deepEqual(dom.makeOffsetPath($cont[0], $i[0].firstChild), [3, 0], 'shuold return [3, 0]');
});

test('dom.fromOffsetPath', function() {
  var $cont, $b, $u, $s, $i;

  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  var cont = $cont[0];
  $.each([$b[0], $u[0], $s[0], $i[0]], function(idx, node) {
    equal(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, node)), node);
    var child = node.firstChild;
    equal(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, child)), child);
  });
});

test('dom.split', function() {
  var $cont, $b, $u, $s, $i;

  // 01. element pivot case
  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $u = $cont.find('u');
  dom.split($cont[0], $u[0], 0);
  equal($cont.html(), '<b>b</b>', 'splitBy u tag with offset 0');
  equal($cont.next().html(), '<u>u</u><s>s</s><i>i</i>', 'right hand side');
  
  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $u = $cont.find('u');
  dom.split($cont[0], $u[0], 1);
  equal($cont.html(), '<b>b</b><u>u</u>', 'splitBy u tag with offset 1');
  equal($cont.next().html(), '<s>s</s><i>i</i>', 'right hand side');
  
  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b');
  dom.split($cont[0], $b[0], 0);
  equal($cont.html(), '', 'splitBy b tag with offset 0 (left edge case)');
  equal($cont.next().html(), '<b>b</b><u>u</u><s>s</s><i>i</i>', 'right hand side');

  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $i = $cont.find('i');
  dom.split($cont[0], $i[0], 1);
  equal($cont.html(), '<b>b</b><u>u</u><s>s</s><i>i</i>', 'splitBy i tag with offset 1 (right edge case)');
  equal($cont.next().html(), '', 'right hand side');
  
  // textNode pivot case
  $cont = $('<div><b>b</b><u>u</u><s>strike</s><i>i</i></div>'); //bustrikei
  $s = $cont.find('s');
  dom.split($cont[0], $s[0].firstChild, 3);
  equal($cont.html(), '<b>b</b><u>u</u><s>str</s>', 'splitBy s tag with offset 3 (middle case)');
  equal($cont.next().html(), '<s>ike</s><i>i</i>', 'right hand side');
  
  $cont = $('<div><b>b</b><u>u</u><s>strike</s><i>i</i></div>'); //bustrikei
  $s = $cont.find('s');
  dom.split($cont[0], $s[0].firstChild, 0);
  equal($cont.html(), '<b>b</b><u>u</u><s></s>', 'splitBy s tag with offset 0 (left edge case)');
  equal($cont.next().html(), '<s>strike</s><i>i</i>', 'right hand side');

  $cont = $('<div><b>b</b><u>u</u><s>strike</s><i>i</i></div>'); //bustrikei
  $s = $cont.find('s');
  dom.split($cont[0], $s[0].firstChild, 6);
  equal($cont.html(), '<b>b</b><u>u</u><s>strike</s>', 'splitBy s tag with offset 6 (right edge case)');
  equal($cont.next().html(), '<s></s><i>i</i>', 'right hand side');

  $cont = $('<div><b>b</b><u>u</u><s>strike</s><i>i</i></div>'); //bustrikei
  $s = $cont.find('s');
  dom.split($s[0], $s[0].firstChild, 3);
  equal($cont.html(), '<b>b</b><u>u</u><s>str</s><s>ike</s><i>i</i>', 'splitBy s tag with offset 3 (2 depth case)');

  $cont = $('<div><b>b</b><u>u</u><s>strike</s><i>i</i></div>'); //bustrikei
  $s = $cont.find('s');
  dom.split($s[0].firstChild, $s[0].firstChild, 3);
  equal($cont.html(), '<b>b</b><u>u</u><s>strike</s><i>i</i>', 'splitBy s tag with offset 3 (1 depth, textNode case)');

  $cont = $('<div><span><b>b</b><u>u</u><s>s</s><i>i</i></span></div>'); //busi
  $span = $cont.find('span');
  dom.split($span[0], $span[0], 2);
  equal($cont.html(), '<span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span>', 'splitBy span tag with offset 2 (1 depth, element case)');
});
