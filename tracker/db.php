<?php 
$db = new PDO(
	'mysql:host=DataBaseHostName;dbname=DataBaseNameHere;charset=utf8', 
	'username', 
	'password', 
	array(	PDO::ATTR_EMULATE_PREPARES => false, 
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
