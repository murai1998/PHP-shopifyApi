<?php


 //================================SMART COLLECTIONS=============================
$items_per_page = 180;
$next_page = '';
$last_page = false;
 $count = 0;
 $a=array();
while(!$last_page) {
$count++;
    $url = '<link>limit=' . $items_per_page  . $next_page . '&fields=id,handle'; // . '&fields=';
 echo $url;
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$headers) {
        $len = strlen($header);
        $header = explode(':', $header, 2);
        if (count($header) >= 2) {
            $headers[strtolower(trim($header[0]))] = trim($header[1]);
        }
        return $len;
    });
    $result = curl_exec($curl);
   
    curl_close($curl);
    if(isset($headers['link'])) {
        $links = explode(',', $headers['link']);
        foreach($links as $link) {
            if(strpos($link, 'rel="next"')) {
                preg_match('~<(.*?)>~', $link, $next);
                $url_components = parse_url($next[1]);
                parse_str($url_components['query'], $params);
             $next_page = '&page_info=' . $params['page_info'];
             $last_page = false;
            } else {
                $last_page = true;
            }
        }
    } else {
        $last_page = true;
    }

    $source_array = json_decode($result);


    foreach ($source_array->smart_collections as $arr) {
        $handle = $arr->handle;
        $id = $arr->id;
        $a["$handle"] =  $id;
    }
}
//===============================================================================


//=============================CUSTOM COLLECTIONS===================================
$items_per_page = 180;
$next_page = '';
$last_page = false;
 $count = 0;
while(!$last_page) {
$count++;
    $url = '<link>?limit=' . $items_per_page  . $next_page . '&fields=id,handle'; // . '&fields=';
 echo $url;
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$headers) {
        $len = strlen($header);
        $header = explode(':', $header, 2);
        if (count($header) >= 2) {
            $headers[strtolower(trim($header[0]))] = trim($header[1]);
        }
        return $len;
    });
    $result = curl_exec($curl);
   
    curl_close($curl);
    if(isset($headers['link'])) {
        $links = explode(',', $headers['link']);
        foreach($links as $link) {
            if(strpos($link, 'rel="next"')) {
                preg_match('~<(.*?)>~', $link, $next);
                $url_components = parse_url($next[1]);
                parse_str($url_components['query'], $params);
                echo $next_page = '&page_info=' . $params['page_info'];
             $last_page = false;
            } else {
                $last_page = true;
            }
        }
    } else {
        $last_page = true;
    }

    $source_array = json_decode($result);


    foreach ($source_array->custom_collections as $arr) {
        $handle = $arr->handle;
        $id = $arr->id;
        $a["$handle"] =  $id;
    }
}
//===============================================================================

//=====================CREATE ARRAY COLLECTION ID => TAGS=======================
$res_arr=array();
 foreach ($a as $key => $val){ 
    $collection_tit = $key;
	$collection_id = $val;
	$all_products = all_pr;
    $all_products = $all_products->products;
    $keys = array_keys($all_products);
    $all_tags = '';
    for($i = 0; $i < count($all_products); $i++) {
        foreach($all_products[$keys[$i]] as $key => $value) {
            if($key === 'tags'){
                $all_tags = $value.",".$all_tags;

            }
        }
        
    }
    $test_arr = explode(", ", $all_tags);
    $test_str = '';
    foreach ($test_arr as $val2) {
        $pieces = explode("_",  $val2);
        if(sizeof($pieces) === 2){
            $test_str = $val2.",".$test_str;
        }
        
      }
      
    $all_tags = implode(',',array_unique(explode(',', $test_str)));
    // echo $all_tags;
    $res_arr["$val"] =  $all_tags;
     
 }

 //===============================================================================
// print_r($res_arr);

foreach ($res_arr as $k1 => $v1){ 
$url = 'metafileds';
$curl = curl_init( $url );
curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$json_response = curl_exec($curl);
curl_close($curl);
$result = json_decode($json_response, TRUE);
$metafields = $result['metafields'];
if(sizeof($metafields) > 0){
foreach($metafields as $metafs){
    if($metafs['namespace'] === "x" && $metafs['key'] === "y"){
        $id = $metafs["id"];
        echo $id;
        $metafield_array = array(
            'metafield'=>array(
                'id' => $id,
                        'value' => $v1,
                        'value_type' => 'string',               
                        
            )
        );
        echo json_encode($metafield_array);
        $url2 = 'metafield';
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url2);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_VERBOSE, 0);
        curl_setopt($curl, CURLOPT_HEADER, 1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($metafield_array));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec ($curl);
        curl_close ($curl);
        print_r($response);
    }
    else{
        if($v1){
        $products_array = array(
            'metafield'=>array(
                'key' => 'y',
                        'value' => $v1,
                        'value_type' => 'string',               
                        'namespace' => 'x'
            )
        );
        echo json_encode($products_array);
        $url = 'metafiled';
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_VERBOSE, 0);
        curl_setopt($curl, CURLOPT_HEADER, 1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($products_array));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec ($curl);
        curl_close ($curl);
        print_r($response); 
    }
    }
}
}
else{
    if($v1){
    $products_array = array(
        'metafield'=>array(
            'key' => 'y',
                    'value' => $v1,
                    'value_type' => 'string',               
                    'namespace' => 'x'
        )
    );
    echo json_encode($products_array);
    $url = 'metafileds';
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_VERBOSE, 0);
    curl_setopt($curl, CURLOPT_HEADER, 1);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($products_array));
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec ($curl);
    curl_close ($curl);
    print_r($response); 
}
}
}
