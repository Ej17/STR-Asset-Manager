<?php /* POST form data with text response - Block 3 Part 6 AJAX */

// Allow debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/plain');
$_POST = urldecode(file_get_contents("php://input"));

$servername = "127.0.0.1";
$username = "admin";
$password = "strassetadmin!";
$dbname = "test";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

$sql = "INSERT INTO deviceUsers (user)
VALUES ('$_POST')";

if (mysqli_query($conn, $sql)) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);
