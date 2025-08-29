// --- بداية كود الاختبار ---

// استيراد الاتصال من الملف الذي أنشأناه
import { supabase } from './supabaseClient';

// دالة لجلب كل الأسماء وطباعتها في الـ console
async function testFetchNames() {
  console.log("جاري محاولة جلب الأسماء...");
  const { data, error } = await supabase
    .from('charity_names') // اسم الجدول
    .select('*'); // اختر كل شيء

  if (error) {
    console.error("حدث خطأ أثناء جلب الأسماء:", error);
  } else {
    console.log("تم جلب الأسماء بنجاح:", data);
  }
}

// دالة لإضافة اسم جديد كاختبار
async function testAddName() {
  console.log("جاري محاولة إضافة اسم جديد...");
  const { data, error } = await supabase
    .from('charity_names')
    .insert([
      { name: 'اختبار من الكود', relation: 'صديق' }
    ]);

  if (error) {
    console.error("حدث خطأ أثناء إضافة الاسم:", error);
  } else {
    console.log("تمت إضافة الاسم بنجاح!");
    // بعد الإضافة، نقوم بالجلب مرة أخرى لنرى الاسم الجديد
    testFetchNames();
  }
}

// تشغيل دوال الاختبار
testFetchNames(); // جلب الأسماء عند بدء التشغيل
testAddName(); // <<--- هذا هو التغيير. سيتم الآن إضافة اسم عند كل مرة تفتح فيها الموقع

// --- نهاية كود الاختبار ---

