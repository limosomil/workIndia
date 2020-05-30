# StockGameServer

### Update 30/05/2020
 - Add dummy user for coupon (0000000000)
~~~~sql
 INSERT INTO `user_data` (`id`, `first_name`, `last_name`, `phone`, `username`, `date_registered`, `last_login`, `last_login_ip`, `FCM_token`, `login_token`, `usr_setupdone`, `type`) VALUES (NULL, 'Coupon', 'Dummy', '0000000000', 'coupondummy', '2000-12-31 00:00:00', NULL, NULL, NULL, NULL, '0', '3');
~~~~
 - End point to add a general coupon code.

- Change couponcode table to not allow NULL Values
~~~~sql
  ALTER TABLE `couponcode` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT, CHANGE `phone` `phone` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, CHANGE `code` `code` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, CHANGE `date_added` `date_added` DATETIME NOT NULL, CHANGE `expiry_date` `expiry_date` DATETIME NOT NULL, CHANGE `amount` `amount` DOUBLE NOT NULL;
~~~~

- Input Validation in addCoupon.
- Log Table for coupon added. 
~~~~sql
  CREATE TABLE `stock_game`.`log_coupon` ( `id` INT NOT NULL AUTO_INCREMENT , `type` TEXT NOT NULL , `log` TEXT NOT NULL , PRIMARY KEY (`id`))
~~~~
- Log usage added to addCoupon

### Update 30/05/2020
 - Added column in wallet table
~~~~sql
  ALTER TABLE `wallet` ADD `coupon_amount` DOUBLE NOT NULL DEFAULT '0' AFTER `money_played`;
~~~~

 - Added logic to check coupon expiry and update coupon amount in wallet.

### Update 28/05/2020 
  - Added count column in coupon codes table
  ~~~~sql
    ALTER TABLE couponcode ADD (count int default 1 NOT NULL)
  ~~~~

  - Endpoint added to redeem coupon.
  - TODO: Add expiry date validation in this endpoint. (DONE).

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

