# البوابة الإسلامية - Islamic Portal

## 📖 نظرة عامة
موقع إسلامي شامل يحتوي على القرآن الكريم والأحاديث النبوية والأدعية والأذكار مع ميزات PWA متقدمة.

## 🌟 الميزات الرئيسية
- **القرآن الكريم**: فهرس شامل مع مشغل صوتي (10 قراء)
- **ترجمات القرآن**: 10 لغات مع مترجمين متعددين
- **الأحاديث النبوية**: من أشهر كتب الحديث
- **الأدعية والأذكار**: 6 تصنيفات متنوعة
- **السبحة الإلكترونية**: عداد ذكي مع إحصائيات
- **مواقيت الصلاة**: 10 مدن مع الأذان والإشعارات
- **ميزة الصدقة الجارية**: لكتابة أسماء المتوفين والدعاء لهم
- **نظام الحسابات**: تسجيل دخول مع إحصائيات شخصية
- **PWA**: يعمل كتطبيق على الهاتف وبدون إنترنت

## 🚀 طريقة التشغيل

### المتطلبات
- Node.js (إصدار 18 أو أعلى)
- bun أو npm

### خطوات التشغيل

1. **فتح terminal/command prompt**
2. **الدخول لمجلد المشروع:**
   ```bash
   cd islamic-portal
   ```

3. **تثبيت المكتبات:**
   ```bash
   # باستخدام bun (الأسرع)
   bun install
   
   # أو باستخدام npm
   npm install
   ```

4. **تشغيل الموقع للتطوير:**
   ```bash
   # باستخدام bun
   bun run dev
   
   # أو باستخدام npm
   npm run dev
   ```

5. **الموقع سيعمل على:** http://localhost:5173

### بناء للنشر

```bash
# بناء ملفات النشر
bun run build

# أو
npm run build
```

سيتم إنشاء مجلد `dist` يحتوي على ملفات الموقع الجاهزة للنشر.

## 📁 هيكل المشروع

```
islamic-portal/
├── public/              # ملفات عامة
│   ├── icons/          # أيقونات التطبيق
│   ├── manifest.json   # ملف PWA
│   ├── sw.js          # Service Worker
│   └── offline.html   # صفحة العمل بدون إنترنت
├── src/
│   ├── components/     # مكونات React
│   ├── data/          # بيانات JSON
│   ├── lib/           # مكتبات مساعدة
│   └── hooks/         # React hooks
├── dist/              # ملفات النشر (بعد البناء)
└── package.json       # معلومات المشروع
```

## 🌐 طرق النشر

### 1. استضافة مجانية (الأسهل)

#### Netlify (موصى به)
1. اذهب إلى [netlify.com](https://netlify.com)
2. قم ببناء المشروع: `bun run build`
3. اسحب مجلد `dist` وأفلته على الموقع
4. سيعطيك رابط مجاني فوراً

#### Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. ارفع الكود على GitHub
3. ربط المشروع مع Vercel
4. نشر تلقائي

### 2. استضافة تقليدية (cPanel/FTP)

1. **بناء المشروع:**
   ```bash
   bun run build
   ```

2. **رفع مجلد `dist` كاملاً** لـ public_html أو www في الاستضافة

3. **التأكد من الإعدادات:**
   - تأكد أن ملف `.htaccess` موجود لإعادة توجيه الروابط
   - فعل GZIP compression إذا كان متاحاً

### ملف .htaccess (للخوادم Apache)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 🔧 إعدادات مهمة

### تخصيص المحتوى
- **بيانات القرآن**: `src/data/quran-surahs.json`
- **الأحاديث**: `src/data/hadith-collections.json`
- **الأدعية**: `src/data/duas-adhkar.json`
- **مواقيت الصلاة**: `src/data/prayer-times.json`

### تخصيص التصميم
- **الألوان**: في `src/index.css`
- **الخطوط**: في `index.html`
- **الأيقونات**: في `public/icons/`

### معلومات التواصل
- **Facebook & Telegram**: في `src/components/ContactUs.tsx`
- **معلومات المطور**: في `package.json`

## 🛡 الأمان والأداء

### SSL Certificate
- Netlify/Vercel: SSL تلقائي مجاني
- استضافة خاصة: استخدم Let's Encrypt

### تحسين الأداء
- ✅ Service Worker للعمل بدون إنترنت
- ✅ ضغط الملفات
- ✅ تخزين مؤقت للمتصفح
- ✅ تحسين الصور

## 🆘 حل المشاكل

### المشروع لا يعمل
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules
bun install

# أو
npm install
```

### خطأ في البناء
```bash
# التأكد من إصدار Node.js
node --version

# يجب أن يكون 18 أو أعلى
```

### الموقع لا يعمل بعد النشر
1. تأكد أن ملف `index.html` في الجذر
2. تأكد من إعدادات الخادم للـ SPA
3. افحص console في المتصفح للأخطاء

## 📞 الدعم

### روابط التواصل
- **Facebook**: https://m.facebook.com/Radwan263
- **Telegram**: https://t.me/Radwan263

### الكود المصدري
- تم تطوير الموقع بـ React + TypeScript + TailwindCSS
- يمكن تعديل الكود حسب الحاجة
- مفتوح المصدر لخدمة الإسلام

## 📄 الترخيص

هذا المشروع مخصص لخدمة الإسلام والمسلمين.
يُسمح بالاستخدام والتعديل والتوزيع مجاناً.

**الهدف**: نشر الخير والعلم الإسلامي

---

## 🤲 دعاء

**اللهم انفع بهذا العمل جميع المسلمين واجعله في ميزان حسناتنا**

**رب اغفر لي ولوالدي وللمؤمنين يوم يقوم الحساب**

---

*تم التطوير بحب لخدمة الإسلام والمسلمين* ❤️