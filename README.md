# Investment Tracking Application
Recruitment task for Fullstack Developer position in a project for TPH Global.

---
### Running the application
The application is deployed on Vercel and utilizes Vercel PostgreSQL database. \
You can access the app at: https://tph-global-recruitment-task.vercel.app. \
<b>Username:</b> <i>quicktrader@crypto.com</i> \
<b>Password:</b> <i>123</i>

### Requirements checklist:
:white_check_mark: Table #1 (using AG Grid) displaying list of investments with details. \
:white_check_mark: Table #2 computing: Total Investment, Total Current Value, Total Gain/Loss. \
:white_check_mark: Updates in table #1 are reflected in table #2 and persisted in the database. \
:white_check_mark: Authentication implemented using NextAuth.js, application can only be accessed after log-in. \
:white_check_mark: Data is stored in a Vercel PostgreSQL database. \
:white_check_mark: Stock data can be exported to CSV. \
:white_check_mark: Application is deployed to Vercel. 

### Local deployment and development:
For local deployment and development, a new Vercel Postgres database would have to be created. \
Blueprint for <b>.env</b> file can be found in <b>.env.example</b> file. Guide on how to create a Vercel Postgres DB 
can be found <a href=https://vercel.com/docs/storage/vercel-postgres/quickstart>here</a>.
Once the database is create tables and seed the database by running:
````
npx prisma db push
npx prisma db seed
````
Then just run ``npm run dev``.