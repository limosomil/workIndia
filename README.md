# StockGameServer

###Update 28/05/2020 7:42PM
 - Fixed the date time formating in updateStocks.js 

###Update 28/05/2020 6:06PM 

Run SQL Query : 
~~~~sql
ALTER TABLE `user_data` ADD `type` TINYINT NOT NULL DEFAULT '1' AFTER `usr_setupdone`;
~~~~

Updated otp.js to set user type to 1 on new user registration.

Added TODO.md file for the things to be done on the overall project.

Fixed bracket issue in profile.js