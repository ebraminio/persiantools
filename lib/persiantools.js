(function (exports) {
  'use strict';

  var persianGlyphs, persianDigits, arabicIndicDigits, arabicDigits,
    persianCharacters, persianPastVerbs, persianPresentVerbs;

  arabicDigits = '0123456789'; // Yes, they called Arabic
  arabicIndicDigits = '٠١٢٣٤٥٦٧٨٩';
  persianCharacters = 'ءاآأإئؤبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیةيك' + 'ًٌٍَُِّْ';
  persianDigits = '۰۱۲۳۴۵۶۷۸۹';

  function descendingFromComparetor(x, y) {
    return x.from - y.from;
  }

  function replaceExcept(text, callback, excepts) {
    var match, result = [], i, ranges, minRange, to, min, max;
    while (text !== '') {
      ranges = [];

      for (i in excepts) {
        if (excepts.hasOwnProperty(i)) {
          // a global regex should be reset before calls
          excepts[i].lastIndex = 0;
          match = excepts[i].exec(text);
          if (match !== null) {
            ranges.push({
              from: match.index,
              to: match.index + match[0].length
            });
          }
        }
      }

      // so nothing is matched
      if (ranges.length === 0) {
        result.push(callback(text));
        break;
      }

      minRange = ranges.sort(descendingFromComparetor)[0];
      min = minRange.from;

      to = [];
      for (i in ranges) {
        if (ranges.hasOwnProperty(i)) {
          if (ranges[i].from <= minRange.to) {
            to.push(ranges[i].to);
          }
        }
      }
      max = Math.max.apply(null, to);

      result.push(callback(text.substr(0, min)));
      result.push(text.substr(min, max - min));
      // console.log('Excepted: "' + text.substr(min, max - min) + '"');
      text = text.substr(max);
    }
    return result.join('');
  }

  if (!String.prototype.trim) { // if is not available currently
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  function cleanUselessZwnj(text) {
    return text
      // Remove more than a ZWNJs
      .replace(/\u200c{2,}/g, '\u200c')
      // Clean ZWNJs after characters that don't conncet to the next letter
      .replace(/([۰-۹0-9إأةؤورزژاآدذ،؛,\:«»\\\/@#$٪×\*\(\)ـ\-=\|])\u200c/g, '$1')
      // Clean ZWNJs before English characters
      .replace(/\u200c([\w])/g, '$1')
      .replace(/([\w])\u200c/g, '$1')
      // Clean ZWNJs after and before punctuation
      .replace(/\u200c([\n\s\[\]\.،«»\:\(\)\؛\؟\?\;\$\!\@\-\=\+\\])/g, '$1')
      .replace(/([\n\s\[\.،«»\:\(\)\؛\؟\?\;\$\!\@\-\=\+\\])\u200c/g, '$1');
  }

  persianGlyphs = {
    // these two are for visually available ZWNJ #visualZwnj
    '\u200cه': 'ﻫ',
    'ی\u200c': 'ﻰﻲ',
    'ﺃ': 'ﺄﺃ',
    'ﺁ': 'ﺁﺂ',
    'ﺇ': 'ﺇﺈ',
    'ا': 'ﺎا',
    'ب': 'ﺏﺐﺑﺒ',
    'پ': 'ﭖﭗﭘﭙ',
    'ت': 'ﺕﺖﺗﺘ',
    'ث': 'ﺙﺚﺛﺜ',
    'ج': 'ﺝﺞﺟﺠ',
    'چ': 'ﭺﭻﭼﭽ',
    'ح': 'ﺡﺢﺣﺤ',
    'خ': 'ﺥﺦﺧﺨ',
    'د': 'ﺩﺪ',
    'ذ': 'ﺫﺬ',
    'ر': 'ﺭﺮ',
    'ز': 'ﺯﺰ',
    'ژ': 'ﮊﮋ',
    'س': 'ﺱﺲﺳﺴ',
    'ش': 'ﺵﺶﺷﺸ',
    'ص': 'ﺹﺺﺻﺼ',
    'ض': 'ﺽﺾﺿﻀ',
    'ط': 'ﻁﻂﻃﻄ',
    'ظ': 'ﻅﻆﻇﻈ',
    'ع': 'ﻉﻊﻋﻌ',
    'غ': 'ﻍﻎﻏﻐ',
    'ف': 'ﻑﻒﻓﻔ',
    'ق': 'ﻕﻖﻗﻘ',
    'ک': 'ﮎﮏﮐﮑﻙﻚﻛﻜ',
    'گ': 'ﮒﮓﮔﮕ',
    'ل': 'ﻝﻞﻟﻠ',
    'م': 'ﻡﻢﻣﻤ',
    'ن': 'ﻥﻦﻧﻨ',
    'ه': 'ﻩﻪﻫﻬ',
    'هٔ': 'ﮤﮥ',
    'و': 'ﻭﻮ',
    'ﺅ': 'ﺅﺆ',
    'ی': 'ﯼﯽﯾﯿﻯﻰﻱﻲﻳﻴ',
    'ئ': 'ﺉﺊﺋﺌ',
    'لا': 'ﻼ',
    'ﻹ': 'ﻺ',
    'ﻷ': 'ﻸ',
    'ﻵ': 'ﻶ'
  };

  function toStandardPersianCharacters(text) {
    var i;
    for (i in persianGlyphs) {
      if (persianGlyphs.hasOwnProperty(i)) {
        text = text.replace(new RegExp('[' + persianGlyphs[i] + ']', 'g'), i);
      }
    }
    return cleanUselessZwnj(text) // needed because of #visualZwnj
      .replace(/ك/g, 'ک') // Arabic
      .replace(/ي/g, 'ی')
      .replace(/ى/g, 'ی') // Urdu
      .replace(/ۍ/g, 'ی') // Pushtu
      .replace(/ې/g, 'ی') // Uyghur
      .replace(/ہ/g, 'ه') // Convert &#x06C1; to &#x0647; ہہہہ to ههه
      .replace(/[ەھ]/g, 'ه'); // Kurdish
  }

  function toPersianDigits(text) {
    var i = 0;
    for (i = 0; i <= 9; i = i + 1) {
      text = text.replace(new RegExp('[' + arabicIndicDigits[i] + arabicDigits[i] + ']', 'g'), persianDigits[i]);
    }
    return text
      .replace(new RegExp('([' + persianDigits + ']) ?%', 'g'), '$1٪')
      .replace(new RegExp('([' + persianDigits + '])\\.(?=[' + persianDigits + '])', 'g'), '$1٫'); // persian decimal separator
  }

  function applyOrthography(text) {
    return text
      // Replace ه followed by (space|ZWNJ|lrm) follow by ی with هٔ
      .replace(/ه[\u200c\u200e\s]+ی([\s\n])/g, 'هٔ$1')
      // Replace ه followed by (space|ZWNJ|lrm|nothing) follow by ء or with هٔ
      .replace(/ه[\u200c\u200e\s]*[ءٔ]([\s\n])/g, 'هٔ$1')
      // Replace هٓ or single-character ۀ with the standard هٔ
      .replace(/(ۀ|هٓ)/g, 'هٔ')
      // Replace ه followed by ئ or ی, and then by ی, with ه\u200cای, example: خانهئی becomes خانه\u200cای
      .replace(/ه\u200c[ئی]ی/g, 'ه\u200cای')
      // Function for removing incorrect ZWNJs
      .replace(/([\u200c\u200e])([\s\n])/g, '$2')
      .replace(/([\s\n])([\u200c\u200e])/g, '$1');
  }

  /**
   * Replaces Persian characters with Arabic's ones so an Arabic sorter can sort Persian lines
   */
  function dePersian(text) {
    return text
      .replace(/ی/g, 'ي')
      .replace(/ک/g, 'ك')
      .replace(/گ/g, 'كی')
      .replace(/ژ/g, 'زی')
      .replace(/چ/g, 'جی')
      .replace(/پ/g, 'بی');
  }

  function persianSortText(text) {
    return text.split('\n').sort(function (x, y) {
      var keyX = dePersian(x),
        keyY = dePersian(y);
      if (keyX < keyY) { return -1; }
      if (keyX > keyY) { return 1; }
      return 0;
    }).join('\n');
  }

  persianPastVerbs = '(' +
    'آراست|آرامید|آزرد|آزمود|آسود|آشامید|آشفت|آغازید|آغشت|آفرید|آگند|آلود|آمد|آمرزید|آموخت|آمیخت|آورد|آویخت|آهیخت|' +
    'ارزید|افتاد|افراشت|افروخت|افزود|افسرد|افشاند|افگند|انباشت|انجامید|انداخت|اندوخت|اندود|اندیشید|انگاشت|انگیخت|اوباشت|' +
    'ایستاد|باخت|بارید|بافت|بالید|بایست|بخشود|بخشید|برازید|برد|برید|بست|بسود|بسیجید|بلعید|بود|بوسید|بویید|بیخت|پاشید|پالود|' +
    'پخت|پذیرفت|پراکند|پرداخت|پرستید|پرسید|پرورد|پرید|پژمرد|پژوهید|پسندید|پلاسید|پلکید|پناهید|پنداشت|پوسید|پوشید|پویید|' +
    'پیچید|پیراست|پیمود|پیوست|تاخت|تافت|تپید|تراشید|تراوید|ترسید|ترشید|ترکید|تکاند|تکانید|تنید|توانست|جست|جُست|جَست|جنبید|جنگید|' +
    'جوشید|جوید|جهید|چاپید|چایید|چپید|چربید|چرخید|چرید|چسبید|چشید|چکید|چلاند|چلانید|چمید|چید|خارید|خاست|خایید|خراشید|خرامید|' +
    'خروشید|خرید|خزید|خست|خشکید|خلید|خمید|خوابید|خواست|خواند|خورد|خوفید|خیسید|داد|داشت|دانست|درخشید|دروید|درید|دزدید|دمید|' +
    'دوخت|دوشید|دوید|دیدم|ربود|رخشید|رسید|رست|رَست|رُست|رشت|رفت|رُفت|روفت|رقصید|رمید|رنجید|رندید|رویید|ریخت|رید|زارید|زایید|زد|' +
    'زدود|زیست|ساخت|سپرد|سپوخت|ستد|سترد|ستود|ستیزید|سرود|سرشت|سرید|سزید|سفت|سگالید|سنجید|سوخت|سود|شاشید|شایست|شتافت|شد|شست|' +
    'شکافت|شکست|شکفت|شکیفت|شگفت|شمرد|شناخت|شنید|شورید|طلبید|طوفید|غارتید|غرید|غلطید|غنود|فرستاد|فرسود|فرمود|فروخت|فریفت|' +
    'فشرد|فهمید|قاپید|قبولاند|کاست|کاشت|کاوید|کرد|کشت|کشید|مکشید|کفت|کفید|کند|کوچید|کوشید|کوفت|گایید|گداخت|گذاشت|گذشت|گرازید|' +
    'گرایید|گردید|گرفت|گروید|گریخت|گریست|گزارد|گزید|گُزید|گَزید|گسارد|گسترد|گسست|گشت|گشود|گفت|گماشت|گنجید|گندید|گوارید|گوزید|' +
    'لرزید|لغزید|لمدنی|لندید|لنگید|لهید|لیسید|ماسید|مالید|ماند|مرد|مکید|مولید|مویید|نازید|نالید|نامید|نشست|نکوهید|نگاشت|' +
    'نگریست|نمود|نواخت|نوردید|نوشت|نوشید|نهاد|نهفت|نیوشید|ورزید|وزید|هراسید|هشت|یارست|یازید|یافت|مالاند|ریسید|پوشاند' +
    ')';

  persianPresentVerbs = '(' +
    'آرای|آرام|آزار|آزمای|آسای|آشام|آشوب|آغاز|آغار|آفرین|آگن|آلای|آی|آمرز|آموز|آمیز|آور|آویز|آهنج|ارز|افت|' +
    'افراز|افروز|افزای|افسر|افشان|افگن|انبار|انجام|انداز|اندوز|اندای|اندیش|انگار|انگیز|اوبار|ایست|باز|بار|باش|باف|بال|' +
    'بای|بخشای|بخش|براز|بر|بُر|بَر|بند|بساو|بسیج|بلع|بو|بوس|بوی|بیز|پاش|پالای|پز|پذیر|پراکن|پرداز|پرست|پرس|پرور|پر|پژمر|' +
    'پژوه|پسند|پلاس|پلک|پناه|پندار|پوس|پوش|پوی|پیچ|پیرای|پیمای|پیوند|تاز|تاب|تپ|توپ|تراش|تراو|ترس|ترش|ترک|تکان|تن|توان|' +
    'جه|جوی|جنب|جنگ|جوش|جو|چاپ|چای|چپ|چرب|چرخ|چر|چسب|چش|چک|چلان|چم|چین|خار|خیز|خای|خراش|خرام|خروش|خر|خز|خست|خشک|خل|خم|' +
    'خواب|خواه|خوان|خور|خوف|خیس|ده|دار|درخش|درو|در|دزد|دم|دوز|دوش|دو|بین|ربای|رخش|رس|ره|روی|رشت|رو|روب|رقص|رم|رنج|رند|' +
    'روی|ریز|رین|زار|زای|زن|زدای|زی|ساز|سپر|سپوز|ستان|ستر|ستان|ستیز|سرای|سرشت|سر|سز|سنب|سگال|سنج|سوز|سای|شاش|شای|' +
    'شتاب|شو|شوی|شکاف|شکن|شکوف|شکیب|شمر|شناس|شنو|شور|طلب|طوف|غارت|غر|غلط|غنو|فرست|فرسای|فرمای|فروش|فریب|فشر|فهم|قاپ|' +
    'قبولان|کاه|کار|کاو|کن|کار|کُش|کش|کِش|کَش|کف|کن|کوچ|کوش|کوب|گای|گداز|گذار|گذر|گراز|گرای|گرد|گیر|گرو|گریز|گری|گزار|' +
    'گز|گزین|گسار|گستر|گسل|گشای|گوی|گمار|گنج|گند|گوار|گوز|لرز|لغز|لم|لند|لنگ|له|لیس|ماس|مال|مان|میر|مک|مول|موی|ناز|' +
    'نال|نام|نشین|نکوه|نگار|نگر|نمای|نواز|نورد|نویس|نوش|نه|نهنب|نیوش|ورز|وز|هراس|هل|یار|یاز|یاب|مال|ریس|پوشان' +
    ')';

  function applyZwnj(text) {
    return cleanUselessZwnj(text)
      .replace(
        new RegExp('(^|[^' + persianCharacters + '])(می|نمی) ?' + persianPastVerbs +
          '(م|ی|یم|ید|ند|)($|[^' + persianCharacters + '])', 'g'),
        '$1$2\u200c$3$4$5'
      )
      .replace(
        new RegExp('(^|[^' + persianCharacters + '])(می|نمی) ?' + persianPresentVerbs +
          '(م|ی|د|یم|ید|ند)($|[^' + persianCharacters + '])', 'g'),
        '$1$2\u200c$3$4$5'
      )
      // ای «توان» ناقلا!
      .replace(/(می|نمی) ?توان/g, '$1\u200cتوان')
      // چسباندن تمام «ها»ها با فاصلهٔ مجازی
      .replace(/\sها([\]\.،\:»\)\s])/g, '\u200cها$1')
      .replace(/\sها(ی|یی|یم|یت|یش|مان|تان|شان)([\]\.،\:»\)\s])/g, '\u200cها$1$2')
      // برای حذف علامت ستاره اضافی قبل از عنوان ها
      .replace(/\n\*\s*(\=+.+?\=+\n)/g, '\n$1')
      // عضو علامت های نقل قول تکی از عنوان ها
      .replace(/(\n=+)(.*?)(?:'+)(.*?)(?:'+)(.*?)(=+\n)/g, '$1$2$3$4$5')
      // برای حذف فاصله های اضافی در پیوندها
      .replace(/\[\[\s*(.*?)\s*\]\]/g, '[[$1]]')
      // تبدیل به نویسه / یکی کردن فاصله های مجازی پشت سرهم
      .replace(/(\{\{فم\}\}|\&zwnj\;|\u200c+)/g, '\u200c')
      // اول و آخر هم خط اگر فاصلهٔ مجازی باشد، حذف شود
      .replace(/(^\u200c|\u200c$)/mg, '')
      // شناسه ها
      // توجه: «است» تعدماً از شناسه ها حذف شده چون به عنوان فعل مستقل هم کاربرد دارد و در آن موارد باید جدا نوشته شود
      // مثال: «این یک خانه است» که است در آن باید از خانه جدا نوشته شود
      .replace(new RegExp('ه\\s+(ام|ای|ایم|اید|اند)($|[^' + persianCharacters + '])', 'g'), 'ه\u200c$1$2')
      // موارد جزئی دیگر و بی ربط به فاصلهٔ مجازی، باید منتقل شود
      .replace(/ا\sً/g, 'اً');
  }

  function punctuation(text) {
    return text
      .replace(/([،\.])([^\s\.\(\)«»\"\[\]<>\d\w\{\}\|۰-۹])/g, '$1 $2')
      .replace(/([\(«])\s/g, '$1')
      .replace(/\s([\)»])/g, '$1')
      .replace(/٬\s/g, '، ')
      .replace(/\n\s{1,}\n/g, '\n\n')
      .replace(/(\n\*.*?)\n+(?=\n\*)/g, '$1') // Removes extra line between two items list
      .replace(/(\n#.*?)\n+(?=\n#)/g, '$1') // Removes extra line between two items list
      .replace(/([^=]) *$/mg, '$1')
      .replace(/ +\( +/g, ' (')
      .replace(new RegExp('([' + persianCharacters + ']) *\\( *(?=[' + persianCharacters + '])', 'g'), '$1 (')
      .replace(new RegExp('([' + persianCharacters + ']) *\\) *(?=[' + persianCharacters + '])', 'g'), '$1) ')
      // Convert , to ، if there are Persian characters on both sides of it
      .replace(new RegExp('([' + persianCharacters + ']) ?, ?(?=[' + persianCharacters + '])', 'g'), '$1، ')
      .replace(/ *([؟،\:؛!\.])/g, '$1') // Remove space preceding punctuations
      // Add Space After Punctuation
      .replace(new RegExp('([' + persianCharacters + ']+)([؟،؛!\\.])([' + persianCharacters + ']+)', 'g'), '$1$2 $3');
  }

  // export
  exports.persianTools = (function () {
    var tools = {
      applyOrthography: applyOrthography,
      applyZwnj: applyZwnj,
      cleanUselessZwnj: cleanUselessZwnj,
      toPersianDigits: toPersianDigits,
      toStandardPersianCharacters: toStandardPersianCharacters,
      persianSortText: persianSortText,
      punctuation: punctuation,
      replaceExcept: replaceExcept
    }, i;

    function Chain(text) {
      this.text = text;
      this.value = function () {
        return this.text;
      };
    }

    function persianTools(text) {
      return new Chain(text);
    }

    function applyTool(tool) {
      return function () {
        this.text = tool(this.text);
        return this;
      };
    }

    for (i in tools) {
      if (tools.hasOwnProperty(i)) {
        persianTools[i] = tools[i];
        Chain.prototype[i] = applyTool(tools[i]);
      }
    }

    return persianTools;
  }());
}(typeof exports === 'object' ? exports : this));
