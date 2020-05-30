# StockGameServer

### Update 30/05/2020 11:34 AM
~~~sql
CREATE TABLE `stock_game`.`competitions` ( `id` INT NOT NULL AUTO_INCREMENT ,  `type` INT NOT NULL ,  `entry_fee` INT NOT NULL ,  `max_entry` INT NOT NULL ,  `entries_count` INT NOT NULL ,  `duration_day` INT NOT NULL ,  `day_added` DATETIME NOT NULL ,  `last_day` DATETIME NOT NULL ,    PRIMARY KEY  (`id`)) ENGINE = InnoDB;

ALTER TABLE `competitions` ADD `cashvalue` INT NOT NULL AFTER `entry_fee`;

ALTER TABLE `comp_entries` ADD CONSTRAINT `fk_payerid` FOREIGN KEY (`player_id`) REFERENCES `user_data`(`id`) ON DELETE CASCADE ON UPDATE CASCADE; ALTER TABLE `comp_entries` ADD CONSTRAINT `fk_compid` FOREIGN KEY (`comp_id`) REFERENCES `competitions`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

CREATE TABLE `stock_game`.`entry_description` ( `entry_id` INT NOT NULL , `scriptcode` INT NOT NULL , `buy_price` INT NOT NULL , `buy_qty` INT NOT NULL , `netvalue` INT NOT NULL ) ENGINE = InnoDB;

ALTER TABLE `entry_description` ADD CONSTRAINT `fk_entryid_desc` FOREIGN KEY (`entry_id`) REFERENCES `comp_entries`(`entry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `stock_game`.`entry_description_bs` ( `entry_id` INT NOT NULL , `scriptcode` INT NOT NULL , `buy_price` INT NOT NULL , `buy_qty` INT NOT NULL , `netvalue` INT NOT NULL, `buy_or_sell` TINYINT NOT NULL ) ENGINE = InnoDB;

ALTER TABLE `entry_description_bs` ADD CONSTRAINT `fk_entryid_bs` FOREIGN KEY (`entry_id`) REFERENCES `comp_entries`(`entry_id`) ON DELETE CASCADE ON UPDATE CASCADE;
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

