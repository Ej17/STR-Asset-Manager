<?php /* POST form data with text response - Block 3 Part 6 AJAX */

// Allow debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
$post_data = json_decode(urldecode(file_get_contents("php://input")));

$user = $post_data->items[0]->User;
//$asset = $post_data->items[1]->Asset;
//$serial = $post_data->items[2]->Serial;


$servername = "127.0.0.1";
$username = "admin";
$password = "strassetadmin!";
$dbname = "test";


$conn = mysqli_connect($servername, $username, $password, $dbname);

// $sql = "INSERT INTO deviceUsers (user, serial, assetID)
// VALUES ('$user', '$asset', '$serial')";

$sql = "INSERT INTO deviceUsers (user)
VALUES ('$user')";

if (mysqli_query($conn, $sql)) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);