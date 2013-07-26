(function () {
  'use strict';
  var persianTools = require('../lib/persiantools.js').persianTools;

  exports.persianTools = {
    'applyOrthography': function (test) {
      test.expect(3);
      test.equal(
        persianTools.applyOrthography('خانهء خانه ٔ خانه ء خانۀ من'),
        'خانهٔ خانهٔ خانهٔ خانهٔ من',
        'اصلاح نویسهٔ غیر استاندارد: ه و همزه بدون فاصله'
      );

      test.equal(
        persianTools.applyOrthography('خانه\u200cی خانه ی من'),
        'خانهٔ خانهٔ من',
        'اصلاح نویسهٔ غیر استاندارد: ه و ی'
      );
      test.equal(
        persianTools.applyOrthography(':خانه ی\n:خانهء\n:خانه\u200cی '),
        ':خانهٔ\n:خانهٔ\n:خانهٔ ',
        'تغییر همزه و خط بعد'
      );
      test.done();
    },
    'toStandardPersianCharacters': function (test) {
      test.expect(1);
      test.equal(
        persianTools.toStandardPersianCharacters('دردﻫﻪ ۱۹۵۰، اﻧﻘﻼب ﺗﻜﻨﻮﻟﻮژی ﺑﺎ ﺳﺮﻋﺖ ﺑﺎﻻﻳﻲ رو ﺑﻪ ﺟﻠﻮ ﺣﺮﻛﺖ ﻣﻲﻛﺮد'),
        'دردهه ۱۹۵۰، انقلاب تکنولوژی با سرعت باﻻیی رو به جلو حرکت می\u200cکرد',
        'تبدیل کاراکترهای فرعی (منقطع) به کاراکتر اصلی'
      );
      test.done();
    },
    'chaining': function (test) {
      test.expect(1);
      test.equal(
        persianTools('خانه\u200cی خانه ی من ' + 'دردﻫﻪ ۱۹۵۰، اﻧﻘﻼب ﺗﻜﻨﻮﻟﻮژی ﺑﺎ ﺳﺮﻋﺖ ﺑﺎﻻﻳﻲ رو ﺑﻪ ﺟﻠﻮ ﺣﺮﻛﺖ ﻣﻲﻛﺮد')
          .applyOrthography().toStandardPersianCharacters().value(),
        "خانهٔ خانهٔ من دردهه ۱۹۵۰، انقلاب تکنولوژی با سرعت باﻻیی رو به جلو حرکت می\u200cکرد",
        'زنجیره'
      );
      test.done();
    }
    // it is simply incomplete, wait please 
  };
}());

