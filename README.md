# Inhouse_Project
There are no node_module files included in the pushed repositories since they are very huge files in mbs and gbs.
For working with the files you need to install these modules:

npm init -y
npm install express mysql body-parser

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

