# FB Ads Report — TE Digital

Web App วิเคราะห์ผล Facebook Ads ด้วย Claude AI อัตโนมัติ

## วิธี Deploy บน Vercel

### ขั้นที่ 1 — อัปโหลดไฟล์
1. ไปที่ [vercel.com](https://vercel.com) → Login ด้วย GitHub
2. กด **Add New Project**
3. ลาก-วาง โฟลเดอร์ `fb-ads-report` ทั้งโฟลเดอร์
4. กด **Deploy**

### ขั้นที่ 2 — ตั้งค่า Environment Variable (ไม่บังคับ)
ถ้าต้องการซ่อน Anthropic API Key ไม่ให้กรอกทุกครั้ง:
- ไปที่ Project Settings → Environment Variables
- เพิ่ม: `ANTHROPIC_API_KEY` = `sk-ant-xxxxxx`

### ขั้นที่ 3 — ใช้งาน
1. กรอก Facebook Access Token
2. กรอก Ad Account ID (เช่น `act_719420100931682`)
3. กรอก Anthropic API Key (ถ้าไม่ได้ตั้งใน Vercel)
4. เลือกช่วงเวลา และกด **ดึงข้อมูล + วิเคราะห์ AI**

## โครงสร้างไฟล์
```
fb-ads-report/
├── index.html          ← หน้า Web App
├── vercel.json         ← Vercel config
├── README.md
└── api/
    ├── insights.js     ← ดึงข้อมูลจาก Meta API
    └── analyze.js      ← วิเคราะห์ด้วย Claude AI
```

## สิ่งที่ต้องมี
- Facebook Access Token (จาก Graph API Explorer)
- Ad Account ID (จาก Ads Manager)
- Anthropic API Key (จาก console.anthropic.com)
