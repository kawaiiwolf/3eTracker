<?php

include_once('../common/debug.php');
include_once('../common/whoami.php');

if (
		$login != 'Anonymous' && 
		isset($_POST['name']) 	&& strlen($_POST['name']) 	> 0 && strlen($_POST['name']) 	< 129 && 
		isset($_POST['action']) && strlen($_POST['action']) > 0 && strlen($_POST['action']) < 129 && 
		isset($_POST['data']) 	&& strlen($_POST['data']) 	> 0 
	)
{
	include_once('db.php');
	$pull = true;
	$rush = false;

	$db->beginTransaction();

	$sql = $db->prepare('SELECT count(*) AS n FROM encounters WHERE `name` = ?;');
	$sql->execute(array($_POST['name']));
	$n = $sql->fetch(PDO::FETCH_ASSOC)['n'];
	
	if ($_POST['action'] == 'INIT')
	{
		if ($n == 0)
		{
			$sql = $db->prepare("INSERT INTO encounters (`name`,`action`,`data`) VALUES ( ? , ? , ? ),( ? , 'STATE', '' );");
			$sql->execute(array($_POST['name'],$_POST['action'],$_POST['data'],$_POST['name']));
		}
		else
			http_response_code(406);
	}
	else if ($n == 0)
		http_response_code(401);
	else
	{
		echo " ";
		if ($_POST['action'] == 'DELETE')
		{
			$sql = $db->prepare("DELETE FROM encounters WHERE `name` = ? ;");
			$sql->execute(array($_POST['name']));
		}
		else if ($_POST['action'] == 'ADD' || $_POST['action'] == 'UPDATE' || $_POST['action'] == 'RETIRE' || $_POST['action'] == 'LOCK')
		{
			$sql = $db->prepare("INSERT INTO encounters (`name`,`action`,`data`) VALUES ( ? , ? , ? );");
			$sql->execute(array($_POST['name'],$_POST['action'],$_POST['data']));
		}
		else if ($_POST['action'] == 'UPDATELOCK' && isset($_POST['ts']) && is_numeric($_POST['ts']))
		{
			$sql = $db->prepare("INSERT INTO encounters (`name`,`action`,`data`) VALUES ( ? , 'UPDATE' , ? ),( ? , 'LOCK' , 'LOCK');");
			$sql->execute(array($_POST['name'],$_POST['data'],$_POST['name']));
			include_once(dirname(__FILE__) . '/pull_encounter.php');
		}
		else if ($_POST['action'] == 'NEXTROUND' && isset($_POST['ts']) && is_numeric($_POST['ts']))
		{
			$sql = $db->prepare("INSERT INTO encounters (`name`,`action`,`data`) VALUES ( ? , ? , ? ),( ? , 'LOCK' , 'LOCK');");
			$sql->execute(array($_POST['name'],$_POST['action'],$_POST['data'],$_POST['name']));
			include_once(dirname(__FILE__) . '/pull_encounter.php');
		}
		else if ($_POST['action'] == 'STATE' && isset($_POST['ts']) && is_numeric($_POST['ts']) )
		{
			$sql = $db->prepare("UPDATE encounters SET `action` = 'STATE', `data` = ? WHERE `name` = ? AND `action` = 'LOCK' AND `ts` = ? ;");
			$sql->execute(array($_POST['data'],$_POST['name'],$_POST['ts']));
			$sql = $db->prepare("DELETE FROM encounters WHERE `name` = ? AND `action` != 'INIT' AND `ts` < (SELECT * FROM ( SELECT MAX(`ts`) FROM encounters WHERE `name` = ? AND `action` = 'STATE') AS x);");
			$sql->execute(array($_POST['name'],$_POST['name']));
			include_once(dirname(__FILE__) . '/pull_encounter.php');
		}
		else 
			http_response_code(406);
	}
	
	$db->commit();
}
else
	http_response_code(406);
