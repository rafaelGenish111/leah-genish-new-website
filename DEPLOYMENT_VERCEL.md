# פריסה ל‑Vercel (שני פרויקטים: שרת ולקוח)

מסמך זה מסביר כיצד לפרוס את המערכת לשני פרויקטים נפרדים ב‑Vercel:
- פרויקט Backend (תיקיית `server/`) כ‑Serverless Functions
- פרויקט Frontend (תיקיית `client/`) כאפליקציית Vite סטטית

## 1) הכנות בקוד (כבר בוצעו)
- `server/server.js` מייצא את ה‑Express `app` ומקשיב לפורט רק בסביבת פיתוח (לא ב‑Vercel).
- נוצר קובץ `server/api/index.js` שעוטף את ה‑app בעזרת `serverless-http`.
- נוסף `server/vercel.json` שמגדיר את ה‑runtime nodejs18 ומנתב את כל הבקשות ל‑`api/index.js`.
- נוספה תלות `serverless-http` ו‑Node 18 ב‑`server/package.json`.
- ב‑Frontend נוסף `client/vercel.json` עם `rewrites` ל‑`index.html` כדי לתמוך ב‑SPA ו‑React Router.

## 2) יצירת שני פרויקטים ב‑Vercel

### Backend (server)
1. התחברי ל‑Vercel ולחצי "New Project".
2. בחרי את ה‑Repository והגדירי **Root Directory** לתיקיית `server`.
3. Build & Output:
   - Framework Preset: "Other"
   - Output Directory: (לא נדרש – זה Serverless)
   - Build Command: (לא נדרש)
4. Environment Variables (חשוב):
   - `MONGODB_URI` – כתובת MongoDB Atlas
   - `JWT_SECRET`
   - `CLIENT_URL` – דומיין ה‑Frontend (למשל `https://<frontend>.vercel.app`)
   - כל שאר המשתנים שכבר קיימים ב‑`.env` (Cloudinary, Calendly וכו')
5. Deploy. לאחר הפריסה תקבלי דומיין לדוגמה: `https://<backend>.vercel.app`.
6. בדקי בריאות: `GET https://<backend>.vercel.app/health`.

> הערה: כל ה‑API יושב תחת `https://<backend>.vercel.app/api/...` (כמו בסביבה המקומית).

### Frontend (client)
1. ב‑Vercel > New Project, בחרי שוב את אותו Repo, והפעם הגדירי **Root Directory** = `client`.
2. Framework Preset: "Vite" או "Other".
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL` = `https://<backend>.vercel.app/api`
6. Deploy. תקבלי דומיין Frontend: `https://<frontend>.vercel.app`.

## 3) בדיקות לאחר פריסה
- פתחי `https://<frontend>.vercel.app` ובדקי ניווט בין כל הדפים.
- ודאי ש‑API עובד דרך `VITE_API_URL` – לדוגמה חפשי בקונסול בקשות ל‑`/api/services`.
- נסי לטעון `/appointments` ולבחור מוצר – ווידג'ט Calendly צריך להיטען.

## 4) עדכוני CORS
ב‑`server/server.js` מוגדר CORS לפי `CLIENT_URL`. אם יש לך דומיינים נוספים (preview/production), הוסיפי אותם ל‑ENV או הגדירי `origin` כמערך.

## 5) ניהול ENV
- פרויקט Backend: הגדירי כל המשתנים של שרת (Mongo, JWT, Cloudinary, Calendly ועוד).
- פרויקט Frontend: הגדירי `VITE_API_URL` בלבד (ועוד משתני Vite אם צריך).

## 6) פקודות שימושיות
- בדיקת שרת: `curl https://<backend>.vercel.app/health`
- API לדוגמה: `curl https://<backend>.vercel.app/api/services`

## 7) טיפים
- אם Calendly לא נטען בפרודקשן – ודאי שה‑URL תקין וש‑CSP של הדפדפן לא חוסם משאבים צד שלישי.
- השתמשי בדף ה‑Logs של Vercel (Backend) כדי לראות שגיאות בזמן אמת.
- בגירסאות Preview – זכרי לעדכן זמנית את `CLIENT_URL` כדי לבדוק CORS (או לאפשר `*` זמנית).

בהצלחה!


