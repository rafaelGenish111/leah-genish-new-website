# הגדרת Admin ראשון

## אופציה 1: יצירת Admin דרך API (מומלץ)

אם אין עדיין משתמשים במערכת, תוכלי ליצור admin ראשון דרך API:

```bash
curl -X POST http://localhost:5000/api/auth/register-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "leahgenish111@gmail.com",
    "password": "Noam2012",
    "name": "לאה גניש"
  }'
```

או באמצעות Postman/Thunder Client:
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register-first-admin`
- Body (JSON):
```json
{
  "email": "your-email@example.com",
  "password": "your-secure-password",
  "name": "Your Name"
}
```

## אופציה 2: יצירת Admin דרך MongoDB (Advanced)

אם יש לך גישה ישירה ל-MongoDB:

```javascript
// התחברי ל-MongoDB
use leah-genish

// צרי משתמש חדש
db.users.insertOne({
  name: "Your Name",
  email: "your-email@example.com",
  password: "$2a$10$hashedpasswordhere", // נא להשתמש ב-bcrypt hash
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**⚠️ שים לב:** הסיסמה חייבת להיות מוצפנת ב-bcrypt. מומלץ להשתמש באופציה 1.

## אופציה 3: יצירת Admin דרך Frontend

1. פתחי את האתר ב: `http://localhost:3030/admin/login`
2. אם אין עדיין משתמשים במערכת, תופיע אופציה ליצירת admin ראשון
3. מלאי את הפרטים ולחצי "יצירת admin"

## בדיקת Admin

לאחר יצירת ה-admin, תוכלי להתחבר:
- URL: `http://localhost:3030/admin/login`
- Email: המייל שציינת
- Password: הסיסמה שציינת

## הוספת Admins נוספים

לאחר שיצרת admin ראשון, תוכלי להוסיף admins נוספים דרך:
1. התחברי כאדמין
2. Admin Panel → Settings → Users
3. או דרך API: `POST /api/auth/register` (דורש authentication)

## שכחת סיסמה?

כרגע אין אופציית reset password מובנית. במקרה זה, תוכלי:
1. לעדכן ידנית ב-MongoDB
2. או ליצור admin חדש ולהיכנס איתו, ואז למחוק את הישן

## אבטחה

- **חובה:** שנה את הסיסמה הראשונית מיד לאחר הכניסה הראשונה
- השתמשי בסיסמה חזקה (לפחות 8 תווים, אותיות ומספרים)
- אל תשתפי את פרטי ההתחברות
- בצעי backup קבוע של ה-DB

## תמיכה

אם נתקלת בבעיות, בדקי:
1. שה-Server רץ: `http://localhost:5000`
2. שה-DB מחובר: בדקי ב-console של השרת
3. שה-environment variables מוגדרים נכון
4. שאין מסמכים ב-collection של users

