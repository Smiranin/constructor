<?php
session_start();
set_time_limit (120);
while (true) {

    if(isset($_SESSION['insta'])) {
        // get content of data.txt
        $data = $_SESSION['insta'];
        // put data.txt's content and timestamp of last data.txt change into array
        $result = array(
            'data' => $data,
            'success' => 1
        );
        // encode to JSON, render the result (for AJAX)
        $json = json_encode($result);
        echo $json;
        // leave this loop step
        break;
    } else {
        // wait for 1 sec (not very sexy as this blocks the PHP/Apache process, but that's how it goes)
        sleep(1);
        continue;
    }
}