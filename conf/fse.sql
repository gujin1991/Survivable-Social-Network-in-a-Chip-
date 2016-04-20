DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS privateMessages;
DROP TABLE IF EXISTS testMessages;
DROP TABLE IF EXISTS users;
DROP TABLE if EXISTS locations;

CREATE TABLE IF NOT EXISTS announcements (announcementId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, status TEXT, time TEXT, content TEXT);
CREATE TABLE IF NOT EXISTS messages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT , nickName TEXT);
CREATE TABLE IF NOT EXISTS privateMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, fromUser TEXT, toUser TEXT, time TEXT, content TEXT, status TEXT, senderNickname TEXT, receiverNickname TEXT);
CREATE TABLE IF NOT EXISTS testMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT);
CREATE TABLE IF NOT EXISTS users (userName TEXT PRIMARY KEY, password TEXT, joinTime TEXT , status TEXT, privilege TEXT, accountStatus TEXT, nickName TEXT);
CREATE TABLE if NOT EXISTS locations (name text PRIMARY KEY, status text, x text, y text, type text, time text);

insert into users Values("SSNAdmin","admin","1/15/2016, 12:00:00 PM","OK","Administrator","active","");
insert into users Values("TesterJin","19911991","1/15/2016, 12:00:00 PM","OK","Administrator","active","");
insert into users Values("TesterYu","admin","1/15/2016, 12:00:00 PM","OK","Administrator","active","");