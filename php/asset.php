<?php
/**
 * Created by PhpStorm.
 * User: flysh
 * Date: 2016/1/31
 * Time: 20:54
 */

$mysql = new mysqli("localhost", "root", "", "pager");
$query = $mysql->query("SELECT * FROM Asset");
while ($row = $query->fetch_assoc()) {
    $arr[] = $row;
}
header("Content-Type: application/json");
echo json_encode($arr);