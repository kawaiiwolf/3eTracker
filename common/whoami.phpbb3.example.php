<?php 
$phpbb_root_path = $_SERVER['DOCUMENT_ROOT'] . '/forum/';
$phpEx = substr(strrchr(__FILE__, '.'), 1);
define('IN_PHPBB', true);
include_once($phpbb_root_path . 'common.' . $phpEx);

$user->session_begin();

$login = $user->data['username'];

unset($user);
unset($db);
unset($cache);
unset($config);
unset($user);
unset($phpbb_root_path);
unset($phpEx);

$request->enable_super_globals();
