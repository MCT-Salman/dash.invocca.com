parties
POST
add services
https://127.0.0.1/admin/services
AUTHORIZATION
Bearer Token
Token
<token>

Body
raw (json)
json
{
  "name": "خدمة الطعام الفاخر",
  "description": "وجبات فاخرة لجميع المناسبات",
  "category": "catering",
  "basePrice": 50,
  "unit": "per_person",
  "requirements": ["مطبخ مجهز", "طاقم طهاة"]
}
Example Request
true
curl
curl --location 'https://127.0.0.1/admin/services' \
--data '{
  "name": "خدمة الطعام الفاخر",
  "description": "وجبات فاخرة لجميع المناسبات",
  "category": "catering",
  "basePrice": 50,
  "unit": "per_person",
  "requirements": ["مطبخ مجهز", "طاقم طهاة"]
}'
201 Created
Example Response
Body
Headers (21)
View More
{
  "success": true,
  "message": "تم إنشاء الخدمة بنجاح",
  "data": {
    "name": "خدمة الطعام الفاخر",
    "description": "وجبات فاخرة لجميع المناسبات",
    "category": "catering",
    "basePrice": 50,
    "unit": "per_event",
    "isActive": true,
    "icon": "fas fa-cog",
    "requirements": [
      "مطبخ مجهز",
      "طاقم طهاة"
    ],
    "createdBy": "68f88b92fefff9749340f85f",
    "_id": "692318120e4fcb5528cf8b47",
    "createdAt": "2025-11-23T14:20:02.760Z",
    "updatedAt": "2025-11-23T14:20:02.760Z",
    "__v": 0,
    "id": "692318120e4fcb5528cf8b47"
  }
}
PUT
edit service
https://127.0.0.1/admin/services/692318120e4fcb5528cf8b47
AUTHORIZATION
Bearer Token
Token
<token>

Body
raw (json)
json
{
  "name": "خدمة الطعام الفاخر",
  "description": "وجبات فاخرة لجميع المناسبات",
  "category": "catering",
  "basePrice": 50,
  "unit": "per_person",
  "requirements": ["مطبخ مجهز", "طاقم طهاة"]
}
Example Request
true
curl
curl --location --request PUT 'https://127.0.0.1/admin/services/692318120e4fcb5528cf8b47' \
--data '{
  "name": "خدمة الطعام الفاخر",
  "description": "وجبات فاخرة لجميع المناسبات",
  "category": "catering",
  "basePrice": 50,
  "unit": "per_person",
  "requirements": ["مطبخ مجهز", "طاقم طهاة"]
}'
200 OK
Example Response
Body
Headers (21)
View More
{
  "success": true,
  "message": "تم تحديث الخدمة بنجاح",
  "data": {
    "_id": "692318120e4fcb5528cf8b47",
    "name": "خدمة الطعام الفاخر",
    "description": "وجبات فاخرة لجميع المناسبات",
    "category": "catering",
    "basePrice": 50,
    "unit": "per_person",
    "isActive": true,
    "icon": "fas fa-cog",
    "requirements": [
      "مطبخ مجهز",
      "طاقم طهاة"
    ],
    "createdBy": "68f88b92fefff9749340f85f",
    "createdAt": "2025-11-23T14:20:02.760Z",
    "updatedAt": "2025-11-23T14:21:49.708Z",
    "__v": 0,
    "id": "692318120e4fcb5528cf8b47"
  }
}
DELETE
del service

templates
GET
view templates
https://127.0.0.1/admin/templates
AUTHORIZATION
Bearer Token
Token
<token>

Example Request
true
curl
curl --location 'https://127.0.0.1/admin/templates'
200 OK
Example Response
Body
Headers (22)
View More
{
  "templates": [
    {
      "_id": "68fc910f2edd3dcd64e51dec",
      "hallId": {
        "_id": "68f8912870c1f99fa73a3837",
        "name": "قاعة الوردة الذهبية",
        "location": "الرياض، حي النخيل",
        "tables": 50,
        "chairs": 500,
        "capacity": 500,
        "maxEmployees": 200,
        "defaultPrices": 800,
        "services": [
          {
            "service": "68f8bfa3e7f7153a896b5510",
            "isIncluded": true,
            "customPrice": 400,
            "_id": "68f8c1008e918263ab41e695"
          }
        ],
        "amenities": [
          "تكييف مركزي",
          "موسيقى حية",
          "إضاءة LED",
          "مطبخ مجهز",
          "مواقف سيارات"
        ],
        "description": "قاعة فاخرة للأفراح والمناسبات الخاصة",
        "isActive": true,
        "generalManager": "68f8912870c1f99fa73a3835",
        "images": [],
        "createdAt": "2025-10-22T08:09:12.255Z",
        "updatedAt": "2025-10-22T11:33:20.781Z",
        "__v": 1,
        "primaryImage": null,
        "id": "68f8912870c1f99fa73a3837"
      },
      "templateName": "gjhgj",
      "imageUrl": "/uploads/1761382671492-pngtree-elegant-blank-card-with-floral-border-for-weddings-or-invitations-image_17079402.jpg",
      "createdAt": "2025-10-25T08:57:51.501Z",
      "updatedAt": "2025-10-25T08:57:51.501Z",
      "__v": 0
    }
  ]
}
POST
add template

client
GET
view client
https://127.0.0.1/manager/clients
Example Request
true
curl
curl --location 'https://127.0.0.1/manager/clients'
200 OK
Example Response
Body
Headers (21)
View More
{
  "success": true,
  "title": "إدارة العملاء",
  "data": [
    {
      "_id": "6922e7df73bfe470459c3803",
      "name": "qwe",
      "phone": "765765",
      "isActive": true,
      "createdAt": "2025-11-23T10:54:23.195Z"
    },
    {
      "_id": "68f8c5074988661b10dda089",
      "name": "qwe",
      "phone": "666666",
      "isActive": true,
      "createdAt": "2025-10-22T11:50:31.773Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 1,
    "total": 2,
    "limit": 10
  }
}
POST
add client

PUT
edit invoice
https://127.0.0.1/manager/financial/invoices/692816877e0ed39bde068d76
Body
raw
{
  "eventId": "68f8c5074988661b10dda08b",
  "dueDate": "2024-02-15",
  "type": "final",
  "notes": "ملاحظات الفاتورة"
}
Example Request
true
curl
curl --location --request PUT 'https://127.0.0.1/manager/financial/invoices/692816877e0ed39bde068d76' \
--data '{
  "eventId": "68f8c5074988661b10dda08b",
  "dueDate": "2024-02-15",
  "type": "final",
  "notes": "ملاحظات الفاتورة"
}'
200 OK
Example Response
Body
Headers (22)
View More
{
  "message": "تم تحديث الفاتورة بنجاح",
  "invoice": {
    "clientInfo": {
      "name": "qwe",
      "phone": "765765",
      "email": "765765",
      "address": "",
      "taxNumber": ""
    },
    "hallInfo": {
      "name": "قاعة الوردة",
      "address": "الرياض، حي النخيل",
      "phone": "",
      "email": "",
      "taxNumber": ""
    },
    "eventInfo": {
      "name": "حفل تخرج الجامعة",
      "date": "2024-12-25T19:00:00.000Z",
      "guestCount": 150
    },
    "_id": "692816877e0ed39bde068d76",
    "hallId": "68f8c1628e918263ab41e6a6",
    "eventId": {
      "_id": "68f8c5074988661b10dda08b",
      "name": "حفل تخرج الجامعة",
      "date": "2024-12-25T19:00:00.000Z",
      "duration": 0,
      "remainingBalance": 0,
      "paymentStatus": "no_payment_required",
      "employeeAssignmentStatus": "no_employees_required",
      "id": "68f8c5074988661b10dda08b"
    },
    "clientId": {
      "_id": "6922e7df73bfe470459c3803",
      "name": "qwe",
      "phone": "765765"
    },
    "invoiceNumber": "INV-202511-0001",
    "type": "final",
    "dueDate": "2024-02-15T00:00:00.000Z",
    "subtotal": 800000,
    "taxRate": 15,
    "taxAmount": 120000,
    "discountAmount": 0,
    "totalAmount": 920000,
    "paidAmount": 0,
    "items": [
      {
        "service": "68f8bfa3e7f7153a896b5510",
        "description": "خدمة تنظيف شاملة",
        "quantity": 400,
        "unitPrice": 2000,
        "totalPrice": 800000,
        "_id": "692816877e0ed39bde068d77"
      }
    ],
    "status": "overdue",
    "paymentTerms": "30 days",
    "notes": "ملاحظات الفاتورة",
    "createdBy": {
      "_id": "68f8c1628e918263ab41e6a4",
      "name": "مدير صالة قاعة الورد"
    },
    "issueDate": "2025-11-27T09:14:47.379Z",
    "createdAt": "2025-11-27T09:14:47.381Z",
    "updatedAt": "2025-11-27T09:16:32.306Z",
    "__v": 0,
    "remainingAmount": 920000,
    "paymentStatus": "unpaid",
    "isOverdue": true,
    "daysOverdue": 652,
    "id": "692816877e0ed39bde068d76"
  }
}
POST
payment
https://127.0.0.1/manager/financial/invoices/692816877e0ed39bde068d76/payment
Body
raw (json)
json
{
  "amount": 2000,
  "paymentMethod": "bank_transfer",
  "reference": "TRX-12345",
  "notes": "دفعة جزئية"
}
Example Request
true
curl
curl --location 'https://127.0.0.1/manager/financial/invoices/692816877e0ed39bde068d76/payment' \
--data '{
  "amount": 2000,
  "paymentMethod": "bank_transfer",
  "reference": "TRX-12345",
  "notes": "دفعة جزئية"
}'
200 OK
Example Response
Body
Headers (22)
View More
{
  "message": "تم تسجيل الدفعة بنجاح",
  "invoice": {
    "clientInfo": {
      "name": "qwe",
      "phone": "765765",
      "email": "765765",
      "address": "",
      "taxNumber": ""
    },
    "hallInfo": {
      "name": "قاعة الوردة",
      "address": "الرياض، حي النخيل",
      "phone": "",
      "email": "",
      "taxNumber": ""
    },
    "eventInfo": {
      "name": "حفل تخرج الجامعة",
      "date": "2024-12-25T19:00:00.000Z",
      "guestCount": 150
    },
    "_id": "692816877e0ed39bde068d76",
    "hallId": "68f8c1628e918263ab41e6a6",
    "eventId": {
      "_id": "68f8c5074988661b10dda08b",
      "hall": "68f8c1628e918263ab41e6a6",
      "name": "حفل تخرج الجامعة",
      "type": "graduation",
      "date": "2024-12-25T19:00:00.000Z",
      "startTime": "17:00",
      "endTime": "18:00",
      "client": "6922e7df73bfe470459c3803",
      "guestCount": 150,
      "requiredEmployees": 5,
      "assignedEmployees": [],
      "services": [
        {
          "service": "68f8bfa3e7f7153a896b5510",
          "quantity": 400,
          "price": 2000,
          "_id": "68f8c5074988661b10dda08c"
        }
      ],
      "totalPrice": 800000,
      "paidAmount": 5000,
      "status": "pending",
      "statusWrite": true,
      "specialRequests": "موسيقى هادئة فقط",
      "createdAt": "2025-10-22T11:50:31.824Z",
      "updatedAt": "2025-11-27T09:09:10.771Z",
      "__v": 0,
      "duration": 1,
      "remainingBalance": 795000,
      "paymentStatus": "partial",
      "employeeAssignmentStatus": "unassigned",
      "id": "68f8c5074988661b10dda08b"
    },
    "clientId": {
      "clientInfo": {
        "totalEvents": 0
      },
      "staffInfo": {
        "hireDate": "2025-11-23T10:54:23.195Z"
      },
      "settings": {
        "language": "ar",
        "notifications": true,
        "theme": "light"
      },
      "_id": "6922e7df73bfe470459c3803",
      "name": "qwe",
      "phone": "765765",
      "password": "$2b$10$sGQ4YAk/S27FuonYkLcF1ucQyYkG7O/utJf3WidhalbMiQ/UdspzO",
      "role": "client",
      "hallId": "68f8912870c1f99fa73a3837",
      "permissions": [
        "manage_invitations",
        "view_own_events"
      ],
      "isActive": true,
      "createdAt": "2025-11-23T10:54:23.195Z",
      "updatedAt": "2025-11-23T10:54:23.195Z",
      "__v": 0
    },
    "invoiceNumber": "INV-202511-0001",
    "type": "final",
    "dueDate": "2024-02-15T00:00:00.000Z",
    "subtotal": 800000,
    "taxRate": 15,
    "taxAmount": 120000,
    "discountAmount": 0,
    "totalAmount": 920000,
    "paidAmount": 2000,
    "items": [
      {
        "service": "68f8bfa3e7f7153a896b5510",
        "description": "خدمة تنظيف شاملة",
        "quantity": 400,
        "unitPrice": 2000,
        "totalPrice": 800000,
        "_id": "692816877e0ed39bde068d77"
      }
    ],
    "status": "overdue",
    "paymentTerms": "30 days",
    "notes": "ملاحظات الفاتورة",
    "createdBy": "68f8c1628e918263ab41e6a4",
    "issueDate": "2025-11-27T09:14:47.379Z",
    "createdAt": "2025-11-27T09:14:47.381Z",
    "updatedAt": "2025-11-27T09:24:41.721Z",
    "__v": 0,
    "remainingAmount": 918000,
    "paymentStatus": "partial",
    "isOverdue": true,
    "daysOverdue": 652,
    "id": "692816877e0ed39bde068d76"
  },
  "transaction": {
    "hallId": "68f8c1628e918263ab41e6a6",
    "eventId": "68f8c5074988661b10dda08b",
    "clientId": "6922e7df73bfe470459c3803",
    "type": "payment",
    "category": "event_payment",
    "amount": 2000,
    "currency": "SAR",
    "paymentMethod": "bank_transfer",
    "status": "completed",
    "reference": "TRX-12345",
    "notes": "دفعة جزئية",
    "processedBy": "68f8c1628e918263ab41e6a4",
    "_id": "692818d97e0ed39bde068d96",
    "processedAt": "2025-11-27T09:24:41.724Z",
    "createdAt": "2025-11-27T09:24:41.725Z",
    "updatedAt": "2025-11-27T09:24:41.725Z",
    "transactionId": "TXN-MIH895Z1-L8XJ4",
    "receiptNumber": "RCP-202511-0002",
    "__v": 0,
    "displayName": "دفعة - 2000 SAR",
    "isPayment": true,
    "statusArabic": "مكتمل",
    "id": "692818d97e0ed39bde068d96"
  }
}
GET
dashboard

POST
add song
https://127.0.0.1/client/events/68f8c5074988661b10dda08b/songs
AUTHORIZATION
Bearer Token
Token
<token>

Body
raw (json)
json
{
  "title": "أغنية الزفاف",
  "artist": "محمد عبده",
  "url": "https://example.com/song.mp3",
  "duration": "04:30",
  "scheduledTime": "2024-02-15T20:00:00.000Z",
  "notes": "أغنية الافتتاح"
}
Example Request
true
curl
curl --location 'https://127.0.0.1/client/events/68f8c5074988661b10dda08b/songs' \
--data '{
  "title": "أغنية الزفاف",
  "artist": "محمد عبده",
  "url": "https://example.com/song.mp3",
  "duration": "04:30",
  "scheduledTime": "2024-02-15T20:00:00.000Z",
  "notes": "أغنية الافتتاح"
}'
201 Created
Example Response
Body
Headers (21)
View More
{
  "success": true,
  "message": "تمت إضافة الأغنية بنجاح",
  "data": {
    "title": "أغنية الزفاف",
    "artist": "محمد عبده",
    "url": "https://example.com/song.mp3",
    "duration": "04:30",
    "isExplicit": false,
    "event": "68f8c5074988661b10dda08b",
    "scheduledTime": "2024-02-15T20:00:00.000Z",
    "playStatus": "pending",
    "orderInEvent": 2,
    "notes": "أغنية الافتتاح",
    "addedBy": {
      "_id": "6922e7df73bfe470459c3803",
      "name": "qwe"
    },
    "_id": "69281f32ed51cfacbad026a6",
    "createdAt": "2025-11-27T09:51:46.938Z",
    "updatedAt": "2025-11-27T09:51:46.938Z",
    "__v": 0
  }
}
GET
detail song
https://127.0.0.1/client/events/songs/69281f32ed51cfacbad026a6
AUTHORIZATION
Bearer Token
Token
<token>

Example Request
true
curl
curl --location 'https://127.0.0.1/client/events/songs/69281f32ed51cfacbad026a6'
200 OK
Example Response
Body
Headers (22)
View More
{
  "success": true,
  "data": {
    "_id": "69281f32ed51cfacbad026a6",
    "title": "أغنية الزفاف",
    "artist": "محمد عبده",
    "url": "https://example.com/song.mp3",
    "duration": "04:30",
    "isExplicit": false,
    "event": {
      "_id": "68f8c5074988661b10dda08b",
      "hall": "68f8912870c1f99fa73a3837",
      "name": "حفل تخرج الجامعة",
      "type": "graduation",
      "date": "2024-12-25T19:00:00.000Z",
      "startTime": "17:00",
      "endTime": "18:00",
      "client": "6922e7df73bfe470459c3803",
      "guestCount": 150,
      "requiredEmployees": 5,
      "assignedEmployees": [],
      "services": [
        {
          "service": "68f8bfa3e7f7153a896b5510",
          "quantity": 400,
          "price": 2000,
          "_id": "68f8c5074988661b10dda08c"
        }
      ],
      "totalPrice": 800000,
      "paidAmount": 7000,
      "status": "pending",
      "statusWrite": true,
      "specialRequests": "موسيقى هادئة فقط",
      "createdAt": "2025-10-22T11:50:31.824Z",
      "updatedAt": "2025-11-27T09:24:41.729Z",
      "__v": 0,
      "duration": 1,
      "remainingBalance": 793000,
      "paymentStatus": "partial",
      "employeeAssignmentStatus": "unassigned",
      "id": "68f8c5074988661b10dda08b"
    },
    "scheduledTime": "2024-02-15T20:00:00.000Z",
    "playStatus": "pending",
    "orderInEvent": 2,
    "notes": "أغنية الافتتاح",
    "addedBy": {
      "_id": "6922e7df73bfe470459c3803",
      "name": "qwe"
    },
    "createdAt": "2025-11-27T09:51:46.938Z",
    "updatedAt": "2025-11-27T09:51:46.938Z",
    "__v": 0
  }
}
PUT
edit song

GET
logout
https://127.0.0.1/auth/logout
AUTHORIZATION
Bearer Token
Token
<token>

Example Request
true
curl
curl --location 'https://127.0.0.1/auth/logout'
200 OK
Example Response
Body
Headers (23)
{
  "message": "تم تسجيل الخروج بنجاح"
}
GET
profile
https://127.0.0.1/auth/me
AUTHORIZATION
Bearer Token
Token
<token>

Example Request
true
curl
curl --location 'https://127.0.0.1/auth/me'
200 OK
Example Response
Body
Headers (21)
View More
{
  "user": {
    "clientInfo": {
      "totalEvents": 0
    },
    "staffInfo": {
      "hireDate": "2025-10-22T07:45:22.719Z"
    },
    "settings": {
      "language": "ar",
      "notifications": true,
      "theme": "light"
    },
    "_id": "68f88b92fefff9749340f85f",
    "name": "مدير عام",
    "phone": "123456",
    "password": "$2b$10$bQxVetl6xkZsNFqRosMPG.0U0MhrsgAa94M/0dBjSUkIUlEIqJRo6",
    "role": "admin",
    "permissions": [
      "manage_halls",
      "manage_managers",
      "manage_templates",
      "view_all_stats",
      "manage_complaints",
      "manage_users"
    ],
    "isActive": true,
    "createdAt": "2025-10-22T07:45:22.722Z",
    "updatedAt": "2025-10-22T07:45:22.722Z",
    "__v": 0
  }
}
PUT
edit profile
https://127.0.0.1/auth/profile
AUTHORIZATION
Bearer Token
Token
<token>

Body
raw (json)
json
{
    "name": "admin",
    "username": "admin",
    "phone": "123456",
    "password": "654321"
}
Example Request
true
curl
curl --location --request PUT 'https://127.0.0.1/auth/profile' \
--data '{
    "name": "admin",
  "phone": "123456",
  "password": "654321"
}'
200 OK
Example Response
Body
Headers (21)
{
  "message": "تم تحديث الملف الشخصي بنجاح",
  "user": {
    "clientInfo": {
      "totalEvents": 0
    },
    "staffInfo": {
      "hireDate": "2025-10-22T07:45:22.719Z"
    },
    "settings": {
      "language": "ar",
      "notifications": true,
      "theme": "light"
    },
    "_id": "68f88b92fefff9749340f85f",
    "name": "admin",
    "phone": "123456",
    "password": "$2b$10$jZoz43RdLfU3.SO6yZUduOsFPnvWy0gGPRhGwZEEFRG6.Kqxk501i",
    "role": "admin",
    "permissions": [
      "manage_halls",
      "manage_managers",
      "manage_templates",
      "view_all_stats",
      "manage_complaints",
      "manage_users"
    ],
    "isActive": true,
    "createdAt": "2025-10-22T07:45:22.722Z",
    "updatedAt": "2025-11-20T10:52:43.143Z",
    "__v": 0
  }
}

---------------------------------
وهذه الالوان التي اريدها
  /* ─────────────────────────────────────────────────────────
     PRIMARY COLORS - الألوان الأساسية (Purple Theme)
     ───────────────────────────────────────────────────────── */
  --color-primary-50: #f8f9fa;
  --color-primary-100: #e9ecef;
  --color-primary-200: #dee2e6;
  --color-primary-300: #ced4da;
  --color-primary-400: #6c757d;
  /* اللون الأساسي */
  --color-primary-500: #1A1A1A;
  --color-primary-600: #161616;
  --color-primary-700: #121212;
  --color-primary-800: #0e0e0e;
  --color-primary-900: #0a0a0a;
  --color-primary-950: #060606;

  /* ─────────────────────────────────────────────────────────
     SECONDARY COLORS - الألوان الثانوية (Lavender Theme)
     ───────────────────────────────────────────────────────── */
  --color-secondary-50: #fdfaf5;
  --color-secondary-100: #faf3e6;
  --color-secondary-200: #f5e9d2;
  --color-secondary-300: #eddcb8;
  --color-secondary-400: #e3cca0;
  /* اللون الأساسي */
  --color-secondary-500: #D8B98A;
  --color-secondary-600: #c4a578;
  --color-secondary-700: #b09266;
  --color-secondary-800: #9c7f54;
  --color-secondary-900: #856c45;
  --color-secondary-950: #6b5837;

  /* ─────────────────────────────────────────────────────────
     SEMANTIC COLORS FOR INVOCA APP- الألوان الدلالية لتطبيق الدعوات
     ───────────────────────────────────────────────────────── */

  /* Gray Colors */
  --color-gray-light: #D8D8D8;
  --color-gray-dark: #6C6C6C;

  /* Yellow Colors */
  --color-yellow-light: #FFF1B3;
  --color-yellow: #FFE36C;
  --color-yellow-pale: #FFF8DA;

  /* Beige/Brown Colors */
  --color-beige-light: #E3CCA9;
  --color-beige-dark: #D99B3D;
