<?php
@session_start();
$req = json_decode($_POST['file']);

// Вытаскиваем необходимые данные
$file = $req->data;
$name = $req->name;

//Здесь должен быть уникальынй индефикатор сессии
$user_id = session_id();

// Все загруженные файлы помещаются в эту папку
$uploadDir = 'saves/' . $user_id;
if(!is_dir($uploadDir)){
    mkdir($uploadDir);
}

if($name === 'canvas'){
//Order Options
    $prefix = $req->product;
    $options = $req->opt;
    $color = $options->color;
    $print = $options->print;
    $quantity = $options->quantity;

    $mime = 'png';
    $randomName = $prefix . '__' . substr_replace(sha1(microtime(true)), '', 12).'.'.$mime;
}else{
    // Получаем расширение файла
    $getMime = explode('.', $name);
    $mime = end($getMime);
    $randomName = substr_replace(sha1(microtime(true)), '', 12).'.'.$mime;
}



// Выделим данные
$data = explode(',', $file);

// Декодируем данные, закодированные алгоритмом MIME base64
$encodedData = str_replace(' ','+',$data[1]);
$decodedData = base64_decode($encodedData);

// Создаем изображение файл
if(file_put_contents($uploadDir.'/'.$randomName, $decodedData)) {
    echo $randomName.":загружен успешно";
}
else {
    // Показать сообщение об ошибке, если что-то пойдет не так.
    echo "Что-то пошло не так. Убедитесь, что файл не поврежден!";
}