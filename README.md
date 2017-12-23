# acme-widget-company

# installing mysql - linux
	sudo apt-get update sudo apt-get install mysql-server
	After the installation process is complete, run the following command to set up MySQL:
	/usr/bin/mysql_secure_installation

# Start the mysql shell
	/usr/bin/mysql -u root -p

# create database
	create database acme;

# set user name and password
	grant all privileges on acme.* to 'root'@'localhost' identified by "password";

# install node packages
	npm install

# start the app
	npm start