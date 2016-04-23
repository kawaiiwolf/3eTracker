<?php

include_once('../common/debug.php');
include_once('db.php');

if ( !isset($_POST['name']) || strlen($_POST['name']) == 0 || strlen($_POST['name']) > 128)
{
	$ret = array();
	$sql = $db->prepare("SELECT `data` FROM encounters WHERE `action` = 'INIT' ORDER BY `ts` LIMIT 25");
	$sql->execute();
	foreach ($sql->fetchAll(PDO::FETCH_ASSOC) AS $row)
		$ret[] = json_decode($row['data']);
	echo json_encode($ret);
}
else if ( isset($_POST['ts']) && is_numeric($_POST['ts']))
{
	$sql = $db->prepare('SELECT count(*) AS n FROM encounters WHERE `name` = ?;');
	$sql->execute(array($_POST['name']));
	$n = $sql->fetch(PDO::FETCH_ASSOC)['n'];
	
	if ($n == 0)
	{
		if($_POST['ts'] == '0')
			http_response_code(403);
		else
			http_response_code(401);
	}
	
	$ret = array();
	
	$sql = $db->prepare("SELECT action, data, ts FROM encounters a LEFT JOIN (SELECT MIN(ts) AS m FROM encounters WHERE action = 'LOCK' AND name = ? ) b ON 1=1 WHERE action != 'INIT' AND (ts <= m OR m IS NULL) AND name = ? AND ts > ?");
	$sql->execute(array($_POST['name'],$_POST['name'],$_POST['ts']));
	foreach ($sql->fetchAll(PDO::FETCH_ASSOC) AS $row)
		$ret[] = $row;
	echo json_encode($ret);
}
else
	http_response_code(406);
