# Inhouse_Project
There are no node_module files included in the pushed repositories since they are very huge files in mbs and gbs.
For working with the files you need to install these modules:

npm init -y
npm install express mysql body-parser

FOR FORGOT PASSWORD FUNCTIONALITY EXECUTE THE FOLLOWING COMMANDS:
npm install nodemailer
npm install dotenv

Table: warden_master_tbl
Columns:
w_id varchar(10) PK 
h_id varchar(10) 
w_type varchar(20) 
w_name varchar(20) 
w_email varchar(30) 
w_contact decimal(10)

Table: user_master_tbl
Columns:
uid int AI PK 
u_type varchar(45) 
username varchar(45) 
pswd varchar(45)

a few git commands:
git clone <link of the code>
git add . - for adding all the changes to your personal system
git commit -m "created new file" - commits changes to the system 
git pull 
git push -u origin main

MAKE A NEW TABLE
create table room_allocation_requests(
    -> s_id varchar(45) NOT NULL,
    -> h_id varchar(10) NOT NULL,
    -> room_no decimal(10,0) NOT NULL,
    -> request_id varchar(10) NOT NULL,
    -> status varchar(20) check(status in('pending','approved','declined'))
    -> FOREIGN KEY (s_id) REFERENCES user_master_tbl(username),
    -> FOREIGN KEY (h_id,room_no) REFERENCES room_master_tbl(h_id,room_no),
    -> CONSTRAINT st_room_pk PRIMARY KEY (s_id,room_no));


commands to create all the tables:
CREATE TABLE `course_tbl` (
  `c_id` varchar(10) NOT NULL,
  `program` varchar(10) NOT NULL,
  `sub` varchar(20) DEFAULT NULL,
  `yr` year NOT NULL,
  `no_st` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `feedback_tbl` (
  `feedback` varchar(4000) DEFAULT NULL,
  `username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `hostel_course_tbl` (
  `h_id` varchar(10) NOT NULL,
  `c_id` varchar(10) NOT NULL,
  `no_of_stu` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`h_id`,`c_id`),
  KEY `c_id` (`c_id`),
  CONSTRAINT `hostel_course_tbl_ibfk_1` FOREIGN KEY (`h_id`) REFERENCES `hostel_master_tbl` (`h_id`),
  CONSTRAINT `hostel_course_tbl_ibfk_2` FOREIGN KEY (`c_id`) REFERENCES `course_tbl` (`c_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `hostel_master_tbl` (
  `h_id` varchar(10) NOT NULL,
  `h_name` varchar(30) NOT NULL,
  `no_floors` decimal(10,0) NOT NULL,
  `no_rooms` decimal(10,0) NOT NULL,
  PRIMARY KEY (`h_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `room_master_tbl` (
  `h_id` varchar(10) NOT NULL,
  `room_no` decimal(10,0) NOT NULL,
  `floor_no` decimal(10,0) NOT NULL,
  `no_seats` decimal(10,0) DEFAULT NULL,
  `vaccant` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`h_id`,`room_no`),
  CONSTRAINT `room_master_tbl_ibfk_1` FOREIGN KEY (`h_id`) REFERENCES `hostel_master_tbl` (`h_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `student_master_tbl` (
  `st_id` varchar(15) DEFAULT NULL,
  `st_roll` decimal(10,0) DEFAULT NULL,
  `st_name` varchar(30) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `program` varchar(30) DEFAULT NULL,
  `sub` varchar(30) DEFAULT NULL,
  `yr` year DEFAULT NULL,
  `st_phno` decimal(10,0) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `f_name` varchar(30) DEFAULT NULL,
  `m_name` varchar(30) DEFAULT NULL,
  `f_phno` decimal(10,0) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  `pincode` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `update_tbl` (
  `detail_type` varchar(45) NOT NULL,
  `detail_current` varchar(500) NOT NULL,
  `detail_new` varchar(500) NOT NULL,
  `username` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `user_master_tbl` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `u_type` varchar(45) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `pswd` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  CONSTRAINT `check_username` CHECK ((`username` like _utf8mb4'%_@__%.__%')),
  CONSTRAINT `chk_type` CHECK ((`u_type` in (_utf8mb4'head',_utf8mb4'assistent',_utf8mb4'mess incharge',_utf8mb4'admin',_utf8mb4'student')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `warden_master_tbl` (
  `w_id` varchar(10) NOT NULL,
  `h_id` varchar(10) DEFAULT NULL,
  `w_type` varchar(20) DEFAULT NULL,
  `w_name` varchar(20) DEFAULT NULL,
  `w_email` varchar(30) DEFAULT NULL,
  `w_contact` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`w_id`),
  KEY `h_id` (`h_id`),
  CONSTRAINT `warden_master_tbl_ibfk_1` FOREIGN KEY (`h_id`) REFERENCES `hostel_master_tbl` (`h_id`),
  CONSTRAINT `check_warden_type` CHECK ((`w_type` in (_utf8mb4'head',_utf8mb4'assistent',_utf8mb4'mess-incharge'))),
  CONSTRAINT `warden_master_tbl_chk_1` CHECK ((`w_email` like _utf8mb4'%_@__%.__%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci