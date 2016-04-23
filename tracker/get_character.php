<?php
include_once('db.php');

if ( !isset($_GET['term']) || ereg($regex_clean,$_GET['term']) || strlen($_GET['term']) > 128 ) $_GET['term'] = '';

$ret = array();

$sql = $db->prepare("SELECT * FROM characters WHERE name LIKE ? LIMIT 15");
$sql->execute(array('%' . $_GET['term'] . '%'));
foreach ($sql->fetchAll(PDO::FETCH_ASSOC) AS $row)
{
	$r = array();
	$r['label'] = $row['name'];
	$r['value'] = $row['name'];
	$r['data'] = $row['data'];
	$ret[] = $r;
}

echo json_encode($ret);
