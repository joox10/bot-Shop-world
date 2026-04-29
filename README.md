# bot-Shop-world

بوت ديسكورد متكامل لإدارة السيرفرات باحترافية عالية ⚙️  
مصمم لتسهيل التحكم، الحماية، وتنظيم كل شيء داخل السيرفر.

---

## ✨ Features | المميزات

- 🤖 Auto Line System (خط تلقائي)
- 🎫 Ticket System (نظام التذاكر)
- 💡 Suggestions System (نظام الاقتراحات)
- 🛡️ Protection System (نظام الحماية)
- 🎮 Nadeko System (نظام ناديكو)
- 💬 Auto Reply System (رد تلقائي)
- 📊 Logs System (نظام اللوج)
- 🎛️ Interactive Menu (منيو تفاعلي بالأزرار)
- ⚡ أوامر Prefix + اختصارات

---

## 📸 Preview | صور من البوت

### 🎛️ Interactive Menu
![Menu](https://res.cloudinary.com/dke6pxph1/image/upload/v1776051056/discord_uploads/p7klcbe5w8ab0n7t7ong.png)

### 📜 Commands
![Commands](https://res.cloudinary.com/dke6pxph1/image/upload/v1776051680/discord_uploads/mxyfj2tuxubsatytmqjm.png)

### 📜 Commands
![Commands](https://res.cloudinary.com/dke6pxph1/image/upload/v1776051728/discord_uploads/esyxontn94rdtkfzwiiw.png)


---

## 🤖 Create Bot | إنشاء البوت

1. ادخل: https://discord.com/developers/applications  
2. اضغط New Application  
3. ادخل قسم Bot → Add Bot  
4. انسخ التوكن (TOKEN)  
5. من OAuth2 → URL Generator:
   - اختار: bot + applications.commands  
   - ادِّي صلاحية Administrator  
6. افتح الرابط وضيف البوت للسيرفر  

---

## ⚙️ Setup | طريقة التشغيل

### 1. تحميل المشروع
```bash
git clone https://github.com/username/repo.git
cd repo

   ---
🧠 شرح config.js (مهم جدًا)
module.exports = {
  token: "YOUR_BOT_TOKEN",
  prefix: "!",
  owner: "YOUR_ID",
  cloudinary: {
    cloud_name: "YOUR_CLOUD_NAME",
    api_key: "YOUR_API_KEY",
    api_secret: "YOUR_API_SECRET"
  
📌 شرح كل جزء:
token
👉 توكن البوت من Discord Developer Portal
❗ 
prefix
👉 البادئة للأوامر (مثال: !help)
owner
👉 ID مالك البوت (أنت)
cloudinary
👉 نظام رفع الصور:
cloud_name → اسم الحساب
api_key → مفتاح API
api_secret → السر

------

☁️ إعداد Cloudinary
ادخل: https://cloudinary.com/
اعمل حساب
من Dashboard هتلاقي:
Cloud Name
API Key
API Secret
حطهم في config.js

----

⚡ شرح evemts/ready.js 

عند تشغيل البوت:

🔹 1. تسجيل السيرفرات
البوت يعرض كل السيرفرات اللي فيها
🔹 2. إنشاء دعوات تلقائيًا
بيعمل Invite لكل سيرفر عنده صلاحية
ويرسلها في روم محدد (log channel)
🔹 3. نظام اللوج
يرسل:
عدد السيرفرات
روابط الدعوة
ضروري في سطر رقم  7 تحط id روم خاصه بلوج
الأخطاء

🔹 4. تشغيل البوت
يظهر في الكونسول:
Bot is now online

▶️للتشغيل السريع :

node index.js
