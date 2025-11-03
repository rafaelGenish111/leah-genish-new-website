# Assets Directory

## מבנה התיקיות

### 📁 images/
**תמונות ומדיה כלליים:**
- `logo.png` / `logo.svg` - הלוגו הראשי של לאה גניש
- `logo-white.png` / `logo-white.svg` - לוגו בגרסת לבן (לרקעים כהים)
- `logo-icon.png` / `logo-icon.svg` - אייקון הלוגו בלבד (לפאביקון)
- תמונות Hero sections
- תמונות רקע
- תמונות דקורטיביות

**דוגמה לשימוש:**
```jsx
import logo from '@/assets/images/logo.svg';

<img src={logo} alt="Leah Genish Logo" />
```

### 📁 icons/
**אייקונים קטנים:**
- פאביקונים
- אייקוני רשתות חברתיות
- אייקונים מותאמים אישית

### 📁 fonts/
**פונטים מותאמים אישית:**
- קבצי פונט מקומיים (אם יש)
- Web fonts שלא מגיעים מ-Google Fonts

## הנחיות

### גדלי קבצים
- **לוגו SVG:** מומלץ ביותר (scalable, קובץ קטן)
- **לוגו PNG:** 
  - גודל רגיל: 400x400px (max 100KB)
  - גודל גדול: 800x800px (max 200KB)
- **תמונות Hero:** 1920x1080px, WebP format (max 300KB)

### שמות קבצים
- השתמש ב-kebab-case: `leah-genish-logo.svg`
- היה ספציפי: `hero-background-1.jpg`
- הוסף גרסאות: `logo-white.svg`, `logo-dark.svg`

### אופטימיזציה
- דחוס תמונות לפני העלאה
- השתמש ב-WebP כאשר אפשרי
- SVG ללוגואים ואייקונים
- PNG רק כאשר נדרש שקיפות
- JPG לתמונות פוטוגרפיות

## כיצד להוסיף את הלוגו?

1. **שים את קובץ הלוגו בתיקייה:**
   ```
   client/src/assets/images/logo.svg
   client/src/assets/images/logo-white.svg (אופציונלי)
   ```

2. **ייבא והשתמש בקוד:**
   ```jsx
   import logo from '../assets/images/logo.svg';
   
   <Box
     component="img"
     src={logo}
     alt="לאה גניש - רפואה משלימה"
     sx={{ width: 120, height: 'auto' }}
   />
   ```

3. **עדכן את הפאביקון:**
   - שים את `favicon.ico` ב-`client/public/`
   - עדכן את `client/index.html` עם הקישורים המתאימים

