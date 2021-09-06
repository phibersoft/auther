## Description
This package used for "cookie-based" jwt authentication.

## Usage
### SQL
Inject src/helpers/Auther.sql to your database.

### Controllers
Copy src/auth/ directory to your controllers/

### Route
Copy routes/index.ts to your routes/auth.ts

### Environment
JWT_SECRET=string

MAIL_USER=email@hotmail.com

MAIL_PASSWORD=password

MAIL_SENDER=name <email@hotmail.com>

MAIL_SMTP_HOST=smtp-mail.outlook.com

MAIL_SMTP_PORT=587

MAIL_RESET_URI=http://localhost:9091/reset-password

### Packages
Run command
```bash
 npm install bcrypt cookie-parser express-async-wrapper helmet jsonwebtoken nodemailer 
 &&
 npm install --save-dev @types/bcrypt @types/cookie-parser @types/jsonwebtoken @types/nodemailer
```