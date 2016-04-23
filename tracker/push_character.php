<?php

include_once('../common/whoami.php');

if ($login != 'Anonymous' && isset($_POST['name']) && strlen($_POST['name']) > 0 && strlen($_POST['name']) < 129 && isset($_POST['data']) && strlen($_POST['data']) > 0 )
{
	include_once('db.php');

	if ($_POST['data'] == 'DELETE')
	{
		$sql = $db->prepare('DELETE FROM characters WHERE `name` = ?;');
		$sql->execute(array($_POST['name']));
	}
	else
	{
		$db->beginTransaction();

		$sql = $db->prepare('SELECT count(*) AS n FROM characters WHERE `name` = ?;');
		$sql->execute(array($_POST['name']));
		$n = $sql->fetch(PDO::FETCH_ASSOC)['n'];
		
		if ($n == 0)
		{
			$sql = $db->prepare("INSERT INTO characters VALUES ( ? , ? );");
			$sql->execute(array($_POST['name'],$_POST['data']));
		}
		else
		{
			$sql = $db->prepare("UPDATE characters SET `data` = ? WHERE `name` = ?;");
			$sql->execute(array($_POST['data'],$_POST['name']));
		}
		
		$db->commit();
	}
}
else http_response_code(406);
