SmartCookBD — Final Upload Package

Netlify-তে নতুন করে আপলোড:
1) ZIP ফাইলটি Extract করুন।
2) Extract করা ফোল্ডারের ভেতরের index.html, style.css, app.js, product.html, product-page.js এবং অন্যান্য ফাইল একসঙ্গে Netlify-তে Deploy করুন।
3) Netlify-তে Deploy manually / drag-and-drop ব্যবহার করলে পুরো ফোল্ডারের ভেতরের ফাইলগুলো দিন; ZIP-এর ভেতরে থাকা অতিরিক্ত ফোল্ডারটি নয়।

পণ্য দেখুন ও অর্ডার:
- পণ্যে ক্লিক করলে আলাদা Product Details পেজ খুলবে।
- “এখনই অর্ডার করুন” চাপলে কার্ট/চেকআউটে যাবে।
- নাম, ফোন ও ঠিকানা দিয়ে “অর্ডার কনফার্ম করুন” চাপলে confirmation এবং order number দেখাবে।
- এই ডেমো সংস্করণে পণ্য/অর্ডার browser localStorage-এ থাকে। অন্য ডিভাইসে অর্ডার দেখতে হলে server/database বা Netlify Forms backend যোগ করতে হবে।

Admin panel-এর password কোডে নির্ধারিত। Public production site-এর জন্য server-side authentication ব্যবহার করা উচিত।
