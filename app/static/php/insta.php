<?php
session_start();
if ($_GET['code']!="") {

    $ClientID = 'afab83d454f74c13a76512231c372c9e';
    $ClientSecret = '4f3fddfef6c44ea991b2e2f7372ffc76';
    $uri = 'http://forjob.esy.es/constructor/insta.php';
    $url = "https://api.instagram.com/oauth/access_token";

    $access_token_parameters = array(
        'client_id' => $ClientID,
        'client_secret'  =>  $ClientSecret,
        'grant_type'  => 'authorization_code',
        'redirect_uri' => $uri,
        'code' => $_GET['code']
    );

    $curl = curl_init($url);
    curl_setopt($curl,CURLOPT_POST,true);
    curl_setopt($curl,CURLOPT_POSTFIELDS,$access_token_parameters);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    curl_close($curl);

    $data = json_decode($data, true);
    $_SESSION['insta'] = $data;
}