# StockGameServer

### Update 9/6/20 00:13am
- Changed playerID to userID in type1/2.js and auth.js

### Update 5/6/2020 - Somil
- Cleaned profile.js
- Added auth to type1, type2, competitioon
- Made change in authID Status 2


### Update 5/06/2020 - Femin
 - On Cascase for wallet :
~~~~sql
  ALTER TABLE `wallet` DROP FOREIGN KEY `wallet_ibfk_1`; ALTER TABLE `wallet` ADD CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user_data`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
~~~~
 - Cleaned /verify of otp.js and added auth logic to it.

### Update 04/06/2020 01:36 AM- Somil

- Created type2.js
- Created table for shortamount
- Edited /create to insert shortamount for type2
- enter nad edit complete
- Modified update entries in type1 and type2

~~~~sql
ALTER TABLE `entry_description_bs` CHANGE `scriptcode` `scripcode` INT(11) NOT NULL, CHANGE `price` `stockprice` INT(11) NOT NULL, CHANGE `qty` `quantity` INT(11) NOT NULL, CHANGE `netvalue` `amount` INT(11) NOT NULL;
ALTER TABLE `entry_description_bs` CHANGE `scripcode` `scripcode` TEXT NOT NULL;
ALTER TABLE `entry_description_bs` CHANGE `stockprice` `stockprice` DOUBLE NOT NULL, CHANGE `amount` `amount` DOUBLE NOT NULL;

CREATE TABLE `shortamount` (
 `id` int(11) NOT NULL,
 `shortamount` double NOT NULL,
 KEY `competition_id` (`competition_id`),
 CONSTRAINT `fk_shortamount` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1
~~~~

### UPDATE 3/06/2020 11:15 AM - Femin
 - /edit added to type1.js 

### UPDATE 3/06/2020 11:15 AM - Femin
 - Add start date column to competitions table
 - Competition status column added to competitions table.
 - Renamed 'cash' to 'balance' in comp_entries
 - MANY MORE CHANGES IN DATABASE. PLEASE SEE FOLLOWING SQL QUERIES FOR MORE DETAILS.
~~~~sql
  ALTER TABLE `competitions` ADD `start_date` DATETIME NOT NULL AFTER `day_added`;
  ALTER TABLE `competitions` ADD `status` INT NOT NULL DEFAULT '1' AFTER `last_day`;
  ALTER TABLE `comp_entries` CHANGE `cash` `balance` INT(11) NOT NULL;

  ALTER TABLE `entry_description` CHANGE `scriptcode` `scripcode` INT(11) NOT NULL, CHANGE `buy_price` `stockprice` INT(11) NOT NULL, CHANGE `buy_qty` `quantity` INT(11) NOT NULL, CHANGE `netvalue` `amount` INT(11) NOT NULL;

  ALTER TABLE `user_data` CHANGE `username` `username` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;

  ALTER TABLE `comp_entries` ADD `username` VARCHAR(20) NOT NULL AFTER `player_id`;

  ALTER TABLE `comp_entries` ADD `date_added` DATETIME NOT NULL AFTER `balance`, ADD `date_edited` DATETIME NOT NULL AFTER `date_added`;

  ALTER TABLE `entry_description` CHANGE `scripcode` `scripcode` TEXT NOT NULL;

  ALTER TABLE `comp_entries` CHANGE `balance` `balance` DOUBLE NOT NULL;

  ALTER TABLE `entry_description` CHANGE `stockprice` `stockprice` DOUBLE NOT NULL, CHANGE `amount` `amount` DOUBLE NOT NULL;
~~~~
 - competition.js edited for start_date
 - /editStatus endpoint added in competition.js **with a todo**
 - /competitionFiles folder will contain all types of competitionFiles. 
 - /competitionFiles/type1/entry end point created.

### UPDADTE 1/06/2020 8:48 PM - Femin
 - Connection Pool Implemented in coupon.js
 - Code cleanup of coupon.js
  
### Update 01/06/2020 7:38 PM - Somil

- Added /getAllCompetitions

### UPDADTE 1/06/2020 5:45 PM - Femin
 - Coupon Redeem endpoint fixed. Tested. Working.
 - Pool Connection File Created.
 - TODO.md updated

### Update 31/05/2020 - Femin
 - Change in Coupon Log table.
~~~~sql
DROP TABLE log_coupon;

CREATE TABLE `stock_game`.`log_coupon` ( `id` INT NOT NULL AUTO_INCREMENT , `coupon_id` TEXT NOT NULL , `coupon_code` TEXT NOT NULL , `amount` DOUBLE NOT NULL , `log_type` TEXT NOT NULL , `phone` TEXT NOT NULL , `user_id` INT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;

ALTER TABLE `log_coupon` ADD `date` DATETIME NOT NULL AFTER `user_id`;

ALTER TABLE `log_coupon` ADD `type` VARCHAR(2) NOT NULL AFTER `date`;

ALTER TABLE `log_coupon` CHANGE `type` `coupon_type` VARCHAR(2) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
~~~~

### Update 31/05/2020 12:00 PM - Somil
- Created competition.js
- Added /create for competition.js

### Update 30/05/2020 2:50 PM
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

### Update 30/05/2020 11:34 AM
~~~sql
CREATE TABLE `stock_game`.`competitions` ( `id` INT NOT NULL AUTO_INCREMENT ,  `type` INT NOT NULL ,  `entry_fee` INT NOT NULL ,  `max_entry` INT NOT NULL ,  `entries_count` INT NOT NULL ,  `duration_day` INT NOT NULL ,  `day_added` DATETIME NOT NULL ,  `last_day` DATETIME NOT NULL ,    PRIMARY KEY  (`id`)) ENGINE = InnoDB;

ALTER TABLE `competitions` ADD `cashvalue` INT NOT NULL AFTER `entry_fee`;


CREATE TABLE `comp_entries` (
 `comp_id` int(11) NOT NULL,
 `player_id` int(11) NOT NULL,
 `entry_id` int(11) NOT NULL AUTO_INCREMENT,
 `cash` int(11) NOT NULL,
 PRIMARY KEY (`entry_id`),
 KEY `comp_id` (`comp_id`),
 KEY `player_id` (`player_id`),
 CONSTRAINT `fk_compid` FOREIGN KEY (`comp_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
 CONSTRAINT `fk_payerid` FOREIGN KEY (`player_id`) REFERENCES `user_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1


CREATE TABLE `stock_game`.`entry_description` ( `entry_id` INT NOT NULL , `scriptcode` INT NOT NULL , `buy_price` INT NOT NULL , `buy_qty` INT NOT NULL , `netvalue` INT NOT NULL ) ENGINE = InnoDB;

ALTER TABLE `entry_description` ADD CONSTRAINT `fk_entryid_desc` FOREIGN KEY (`entry_id`) REFERENCES `comp_entries`(`entry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `stock_game`.`entry_description_bs` ( `entry_id` INT NOT NULL , `scriptcode` INT NOT NULL , `buy_price` INT NOT NULL , `buy_qty` INT NOT NULL , `netvalue` INT NOT NULL, `buy_or_sell` TINYINT NOT NULL ) ENGINE = InnoDB;

ALTER TABLE `entry_description_bs` ADD CONSTRAINT 
`fk_entryid_bs` FOREIGN KEY (`entry_id`) REFERENCES `comp_entries`(`entry_id`) ON DELETE CASCADE ON UPDATE CASCADE;
~~~

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

