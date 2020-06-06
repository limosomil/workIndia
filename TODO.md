#TODO LIST

- Global Todo : 
  - use HTTP status codes with all responses.
  - JWT Signing [DONE]
  - Log database
  - SQL Injection Prevention
  - CASCADE DELETE for wallet. [DONE]
  - Auto coupon for new user ? How ?
  - Add transaction to EVERY MySql Query group
  - Time timezone locale to every moment function.
  - Promisify The Connection. [DONE]
  - Connection Pool [DONE]
  - Convert all files to use Promisified Connection Pool. [DONE]
  - Add return wherever response is sent. [DONE]
  - USE LOGS EVERYWHERE
  - release connection before every json response.
  - Make a global function in helpers for checkUndefined function
  - Add Auth for checking user login token when app launches.
  - Referral System to get virtual money. Create new table, check if a user has used a referral, if not then he is elligible to use a referral code. Referrer and referee get some amount. (Update wallet coupon_money).

  - Admin end point to remove an entry. Must update all the three tables. Only for special requests.

- Local Todo :
  - 1/0 field in competition for public and private competition
  - Note the login time in last_login in user_data

- Possible loopholes, username is not a foreign key in comp_entries