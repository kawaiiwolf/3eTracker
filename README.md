# 3eTracker
Exalted 3e Online Tick Tracker

Online tick tracker for Exalted 3rd Edition, distributed under the MIT License.
A beta/demo version can be found: http://tracker.3eeweb.com/
(Note: This is a beta version for demonstration and will not be receiving regular (if any) updates. It is available for anyone to alter and should not be considered safe for play. Please don't break it)


# Features

- Lists characters with room for motes/willpower and text for other notes such as Health
- Keeps track of Initiative and who moves next
- Fully Multiplayer. Updates on one players screens are synchronized with other players
- Save character templates (such as your players) for use later
- Dynamically loads images for Characters
- Allows multiple concurrent Encounters/Battles at one time. Currently limited to displaying only the first 25
- Easily sharable links: Join/Create an Encounter and send your current URL to a friend to join


# Tips

- If a player doesn't get a chance to update their Initiative before another presses the 'GO' button, any player may edit the current tick
- Remember to Save your character under the "Add a Character" if you want to use them over and over.
- Security built fairly loosely. Any player can edit any field. You can limit which web users have access to this application. See Installation below.

# Installation

Requirements:
- An up to date version of PHP with PDO (https://secure.php.net/manual/en/book.pdo.php). Most websites include this already
- A SQL database. This was built to work with MYSQL

Steps:
- Create the tables outlined in the setup.sql file. The database user for this project requires SELECT/INSERT/UPDATE/DELETE on the two tables created by the .sql file
- Update tracker/db.php with the host/database/username/password necessary for the application to gain access to these SQL tables
- Optional: Control access via common/whoami.php. $login should be set to 'Anonymous' for invalid logins. tracker/whoami.phpbb3.example.php is provided as an example. It requires a phpbb3 login to utilize the application (It assumes the forms are located in the www.site.com/forum/ directory. Adjust the location if your location differs.)
