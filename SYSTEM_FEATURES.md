Tour System Feature Documentation
เอกสารฉบับนี้รวบรวมรายการฟีเจอร์ทั้งหมดของระบบ Tour System Prototype (เวอร์ชันปัจจุบัน) โดยแบ่งตามโมดูลการทำงาน เพื่อให้เห็นภาพรวมความสามารถของระบบ
Last Updated: 2026-01-22
1. Booking Wizard (ระบบจองทัวร์)
กระบวนการจองทัวร์แบบ Step-by-Step ที่ออกแบบมาเพื่อลดความผิดพลาดและใช้งานง่าย
1.1 Step 1: Select Route (เลือกเส้นทาง)
แสดงรายการเส้นทางทัวร์ทั้งหมดพร้อมรูปภาพปก
แสดงรหัสทัวร์ (Tour Code) และชื่อประเทศ

1.2 Step 2: Select Round (เลือกรอบเดินทาง)
แสดงตารางรอบเดินทางของเส้นทางที่เลือก
ข้อมูลละเอียด: แสดงสายการบิน, วันที่เดินทาง, ราคา (ผู้ใหญ่พักคู่ / พักเดี่ยว), จำนวนที่นั่งทั้งหมด
Status Indicator: แสดงสถานะที่นั่ง (Available หรือ Sold Out)

1.3 Step 3: Passenger Details (ระบุตั๋วและผู้เดินทาง)
รายชื่อผู้จองในรอบ: แสดงตารางผู้ที่จองแล้วในรอบนั้น พร้อมข้อมูล:
ชื่อ-นามสกุล
ผู้ขาย (Sale ที่เพิ่มลูกค้า)
วันที่ชำระเงิน
ยอดจอง (ราคาตามประเภทห้อง)
สถานะการชำระ (ชำระแล้ว / ชำระบางส่วน / รอชำระ)
แถวรวมยอดจอง: แสดงยอดรวมทั้งหมดของรอบนั้น
Head Responsible: ระบุชื่อหัวหน้าทัวร์หรือผู้ดูแล Route นี้
Customer Search: ค้นหาประวัติลูกค้าเก่าจากฐานข้อมูล (ชื่อ หรือ เลขพาสปอร์ต) และเพิ่มลงใน Booking ได้ทันที
Dynamic Pricing: สามารถเลือกประเภทห้องพักให้ลูกทัวร์แต่ละคนได้ (Adult Twin, Single, Triple, etc.)
Payment Insight: แสดงยอดชำระแล้ว (Paid) และยอดคงค้าง (Balance) ของแต่ละบุคคล พร้อมสถานะสีที่ชัดเจน (แดง/เขียว)
Smart Estimation: คำนวณยอดรวมที่ต้องชำระจริงโดยอ้างอิงจาก ยอดคงค้าง (Balance) ของผู้เดินทางที่เลือก

1.4 Payment Options (ตัวเลือกการชำระ)
ยืนยันการจอง: สร้าง Booking Record พร้อมสถานะการเงินเริ่มต้น สามารถชำระผ่าน โอนเงิน (Transfer) หรือ เงินสด (Cash) เท่านั้น
QR Code/Credit/Cheque Removed: นำออกตามความต้องการ (Refined Payment Methods)

1.5 ระบบแจ้งชำระเงิน (Payment Notification System)
Slip Attachment: เซลล์สามารถแนบสลิปการโอนเงินเข้าสู่ระบบ พร้อมระบุยอดเงินและวันที่ชำระ
Payment Verification: Admin/Manager ตรวจสอบสลิปและอนุมัติการชำระเงิน
Status Tracking: ติดตามสถานะการชำระ (รอตรวจสอบ / อนุมัติแล้ว / ปฏิเสธ)
Transaction History: บันทึกประวัติการชำระเงินทุกรายการพร้อมหลักฐาน

2. Operations (ระบบปฏิบัติการ / การปิดกรุ๊ป)
เครื่องมือสำหรับทีม Operation เพื่อเตรียมความพร้อมก่อนเดินทางและปิดกรุ๊ปทัวร์
2.1 Smart Operation Alerts (การแจ้งเตือนงานปฏิบัติการ)
ระบบตรวจสอบอัตโนมัติ 3 ส่วนสำคัญเพื่อป้องกันข้อผิดพลาด:
Birthday Alert: แจ้งเตือนรายชื่อลูกทัวร์ที่มีวันเกิดตรงกับช่วงวันเดินทาง
Visa & Prep Docs: แจ้งเตือนสถานะการเตรียมเอกสารและวีซ่าของกรุ๊ป
Flight Ticket Status: สรุปสถานะการจองและออกตั๋วเครื่องบิน

2.2 Round Listing (รายการรอบทัวร์)
Overview Card: แสดงข้อมูลสรุปของแต่ละรอบ (Route Code, วันที่, หัวหน้าทัวร์, จำนวน Pax)
Progress Bar: แถบแสดง % ความพร้อมของทัวร์นั้นๆ
Guide Assignment: ระบบมอบหมายไกด์ประจำกรุ๊ป

2.3 Pax Manifest (บัญชีรายชื่อลูกทัวร์)
ตารางรายชื่อลูกทัวร์ทุกคนในรอบนั้นๆ พร้อมข้อมูลพาสปอร์ต
Task Checklist: เช็คลิสต์งานรายบุคคล (Passport, Visa, Ticket, Insurance, Payment)
Guide Checklist: เช็คลิสต์สำหรับไกด์/หัวหน้าทัวร์ (ตรวจสอบตั๋วเครื่องบิน, ตรวจสอบที่พัก)
Smart Child Logic: เปลี่ยนช่องเช็ค Passport เป็น "Birth Cert" อัตโนมัติสำหรับเด็กอายุต่ำกว่า 15 ปี
Attachment View: ไอคอนแสดงไฟล์แนบ

2.4 การปิดกรุ๊ป (Close Group)
ตรวจสอบความพร้อม: ดู Progress Bar และ Checklist
ดาวน์โหลดเอกสาร: ปุ่มดาวน์โหลดรายชื่อ, ใบเตรียมตัว (Mockup)
Luggage Tag Generator: ระบบสร้างป้ายติดกระเป๋าอัตโนมัติพร้อม Preview ก่อนพิมพ์

3. Payment & Finance (การเงินและเอกสาร)
ระบบติดตามสถานะการเงิน, ดูรายละเอียดการชำระ, และออกเอกสารสำคัญ
3.1 Financial Overview
การ์ดยอดคงค้างรวม: แสดงยอดเงินที่ยังค้างรับ
การ์ดยอดรับเดือนนี้: แสดงยอดที่ได้รับแล้ว

3.2 Transaction Table
ตารางแสดงประวัติธุรกรรมทั้งหมด พร้อมสถานะและวันที่
Filter/Sort: กรองดูรายการชำระตามเงื่อนไข

3.3 Document Issuance (ระบบออกเอกสาร)
Billing Note (ใบวางบิล): สร้างใบวางบิลเพื่อแจ้งหนี้ลูกค้าหรือเอเจนซี่
Temporary Receipt (ใบรับเงิน): ออกเอกสารรับเงินเบื้องต้น
Official Receipt (ใบเสร็จรับเงิน): เพิ่มฟังก์ชันเมนูสำหรับออกใบเสร็จรับเงินฉบับจริง (Tax Invoice) สำหรับลงบัญชี

4. CRM (ระบบบริหารลูกค้าสัมพันธ์)
ฐานข้อมูลลูกค้าเพื่อการบริการที่ต่อเนื่อง
Customer Database: เก็บข้อมูลลูกค้า (ชื่อ, พาสปอร์ต, เบอร์โทร, ไลน์, ฯลฯ)
Data Separation: แยกคอลัมน์ ข้อมูลการติดต่อ (Contact) และ หมายเหตุ (Note) เพื่อความชัดเจน
Owner Tracking: แสดงชื่อพนักงาน (Admin/Sale) ผู้ที่เป็นเจ้าของข้อมูล (คนเพิ่มลูกค้า) สำหรับการติดตาม
Interactive Form:
ฟอร์มเพิ่ม/แก้ไขข้อมูลที่ครบถ้วน (Passport Check, Age Calculation)
Manage Owner: ระบบกำหนดผู้ดูแลอัตโนมัติ และ Manager สามารถเปลี่ยนสิทธิ์ผู้ดูแลลูกค้าได้
Blacklist Management: ระบบจัดการรายชื่อบุคคลเฝ้าระวัง
5. Dashboard (แผงควบคุมหลัก)
แยกมุมมองตามบทบาทผู้ใช้งาน (Role-Based Dashboard)
5.1 Executive Dashboard (สำหรับผู้บริหาร/Manager)
Key Metrics: แสดงยอดขายรวม (Total Sales), รายได้จริง (Revenue), และสัดส่วนทัวร์ (Active/Completed)
Overview: ภาพรวมสถานะบริษัททัวร์ทั้งหมด

5.2 Sale Dashboard (สำหรับพนักงานขาย)
My Performance:
Commission: แสดงยอดคอมมิชชั่นสะสมตาม Rank และยอดขายของตนเอง
Total Sales: ยอดขายรวมที่ทำได้
Pax Count: จำนวนลูกทัวร์ที่ดูแล
Job Tracking: ตารางติดตามสถานะงานขาย (Active Rounds)
แสดงทัวร์ที่ตนเองมีลูกค้า
Status Indicators: แจ้งเตือนเอกสารขาด (Passport) และยอดค้างชำระ (Unpaid) เพื่อให้ Sale ตามงานได้ทันที

6. ระบบจัดการสิทธิ์ผู้ใช้งาน (Role-Based Access Control)
Manager: Full Access (จัดการ Route, User, Commission, แก้ไขข้อมูลได้ทุกส่วน)
Sale: ดูแล Booking ของตนเอง, เพิ่มลูกค้า, ดู Dashboard
Guide: ดูรายชื่อลูกทัวร์, เช็คลิสต์หน้างาน (Ticket/Hotel)
Interactive Switcher: เปลี่ยน Role ได้ทันทีเพื่อทดสอบระบบ

7. System Settings (ตั้งค่าระบบ)
User Management: เพิ่ม/ลด/แก้ไข พนักงาน
Commission Setup:
กำหนด Rank ค่าคอมมิชชั่น (Rank 1 / Rank 2)
Role Constraint: ซ่อนตัวเลือก Rank สำหรับตำแหน่งที่ไม่ได้รับคอมมิชชั่น (Manager, Guide/Operation) อัตโนมัติ



8. Product Management (บริหารจัดการทัวร์)
Route Approval: ฟังก์ชันอนุมัติ Route/Round (Sub-routes) เพื่อเปลี่ยนสถานะเป็น "พร้อมขาย" (Selling)
Quality Control: ป้องกันการขายทัวร์ที่ข้อมูลยังไม่ครบถ้วนหรือไม่ผ่านการอนุมัติ

9. LINE Official Account (ระบบลูกค้าสัมพันธ์ผ่าน LINE)
ระบบ LINE OA สำหรับการสื่อสารและติดตามข้อมูลกับลูกค้าโดยตรง
9.1 Customer Registration (ลงทะเบียนลูกค้า)
LINE ID Linking: เชื่อมบัญชี LINE ของลูกค้าเข้ากับระบบ CRM
Rich Menu: เมนูหลักสำหรับลูกค้าเข้าถึงฟีเจอร์ต่างๆ
Auto Welcome Message: ข้อความต้อนรับอัตโนมัติเมื่อลูกค้าเพิ่มเพื่อน

9.2 Tour Tracking (ติดตามทัวร์ที่จอง)
My Bookings: ลูกค้าสามารถดูรายการทัวร์ที่จองทั้งหมดผ่าน LINE
Booking Status: แสดงสถานะการจอง (ยืนยันแล้ว / รอชำระ / เสร็จสิ้น)
Trip Details: ดูรายละเอียดทัวร์ (วันเดินทาง, สายการบิน, ไกด์ประจำกรุ๊ป)

9.3 Payment Reminders (แจ้งเตือนการชำระเงิน)
Stage-Based Notifications: แจ้งเตือนตามขั้นตอนการชำระ:
งวดที่ 1: มัดจำ
งวดที่ 2: ชำระก่อนออกตั๋ว
งวดที่ 3: ชำระส่วนที่เหลือก่อนเดินทาง
Group-Specific Alerts: แจ้งเตือนตาม Group/Round ที่ลูกค้าจอง

10. Customer Landing Page (หน้าเว็บลูกค้า)
หน้าเว็บไซต์สำหรับลูกค้าดูข้อมูล package ทัวร์ที่เปิดขาย
10.1 Tour Catalog (แค็ตตาล็อกทัวร์)
Route Listing: แสดงรายการเส้นทางทัวร์ทั้งหมดที่เปิดขาย
Category Filter: กรองตามหมวดหมู่
Search Function: ค้นหาทัวร์ตามชื่อหรือประเทศ
10.2 Tour Details (รายละเอียดทัวร์)
Program Overview: โปรแกรมการเดินทางแบบวันต่อวัน
Highlights: ไฮไลท์สำคัญของทริป
Price Table: ตารางราคาตามประเภท (Twin/Single/Triple/Child)
Inclusion/Exclusion: รายการที่รวม/ไม่รวมในราคา
Terms & Conditions: เงื่อนไขการจองและยกเลิก

10.3 Inquiry & Contact (สอบถามและติดต่อ)
Inquiry Form: ฟอร์มฝากข้อมูลติดต่อกลับ (ชื่อ, เบอร์โทร, LINE ID)
LINE Connect Button: ปุ่มเพิ่มเพื่อน LINE OA โดยตรง
Contact Info: แสดงข้อมูลติดต่อบริษัท
Social Links: เชื่อมต่อ Social Media (Facebook, Instagram)

10.4 Responsive Design
Mobile First: ออกแบบรองรับการใช้งานบนมือถือเป็นหลัก
