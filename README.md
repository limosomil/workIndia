# StockGameServer

### Update 28/05/2020 
  - Added count column in coupon codes table
  ~~~~sql
    ALTER TABLE couponcode ADD (count int default 1 NOT NULL)
  ~~~~

  - Endpoint added to redeem coupon.
  - TODO: Add expiry date validation in this endpoint.

### Update 28/05/2020 11:52 PM

Run Query:
~~~sql
ALTER TABLE `user_data` ADD `username` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL AFTER `phone`;
~~~
- Updated user_data
- Update profile.js : Now checks for unique username, valid username, updates details in user_data

### Update 28/05/2020 8:45 PM
- Updated TODO.md
- Added wallet Initialization code on new user otp verification.


### Update 28/05/2020 7:42PM
 - Fixed the date time formating in updateStocks.js 
 - Updated TODO.md

### Update 28/05/2020 6:06PM 

Run SQL Query : 
~~~~sql
ALTER TABLE `user_data` ADD `type` TINYINT NOT NULL DEFAULT '1' AFTER `usr_setupdone`;
~~~~

Updated otp.js to set user type to 1 on new user registration.

Added TODO.md file for the things to be done on the overall project.

Fixed bracket issue in profile.js

