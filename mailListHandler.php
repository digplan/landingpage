<?php
error_reporting(0); // hide all basic notices from PHP

// Future-friendly json_encode
if( !function_exists('json_encode') ) {
    include_once 'inc/JSON.php';
    function json_encode($data) {
        $json = new Services_JSON();
        return( $json->encode($data) );
    }
}

// Future-friendly json_decode
if( !function_exists('json_decode') ) {
    include_once 'inc/JSON.php';
    function json_decode($data) {
        $json = new Services_JSON();
        return( $json->decode($data) );
    }
}

if(!class_exists('MailChimp')) {
    include 'inc/MailChimp.class.php';
}

//If the form is submitted

function minigoMailHandler() {
    include 'config.php';

    if(isset($_POST['subscribe']) && isset($_POST['email'])) {

        if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {

            if(!$use_Mailchimp) {
                $file = $maillist_file;
                $content = file_get_contents($file);

                if(stripos($content, $_POST['email']) !== false) {
                    echo 'success';
                    exit;
                }

                file_put_contents($file, $content.$_POST['email']."\n");
                echo 'success';
                exit;
            } else {
                $MailChimp = new MailChimp($mailchimp_API_Key);
                //print_r($MailChimp->call('lists/list'));

                $result = $MailChimp->call('lists/subscribe', array(
                                'id'                => $mailchimp_list_ID,
                                'email'             => array('email'=>$_POST['email']),
                                //'merge_vars'        => array('FNAME'=>'Davy', 'LNAME'=>'Jones'),
                                'double_optin'      => false,
                                'update_existing'   => true,
                                'replace_interests' => false,
                                'send_welcome'      => false,
                            ));

                if(!empty($result['email']) && !empty($result['euid']) && !empty($result['leid'])) {
                    echo 'success';
                    exit;
                }
                echo 'error';
                exit;
            }
        } else {
            echo 'error';
            exit;
        }
    }

    if(isset($_POST['contact'])) {

    // require a name from user
    if(trim($_POST['name']) === '') {
        $nameError =  'Forgot your name!';
        $hasError = true;
    } else {
        $name = htmlspecialchars(strip_tags($_POST['name']), ENT_QUOTES, 'utf-8');
    }

    // need valid email
    if(trim($_POST['email']) === '')  {
        $emailError = 'Forgot to enter in your e-mail address.';
        $hasError = true;
    } elseif(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $emailError = 'You entered an invalid email address.';
        $hasError = true;
    } else {
        $email = trim($_POST['email']);
    }

    // we need at least some content
    if(trim($_POST['message']) === '') {
        $commentError = 'You forgot to enter a message!';
        $hasError = true;
    } else {
        $message = htmlspecialchars(strip_tags($_POST['message']), ENT_QUOTES, 'utf-8');
    }

    // upon no failure errors let's email now!
    if(!isset($hasError)) {

        $emailTo = $target_address;
        $subject = $subject_prefix.$name;
        $body = "Name: $name \n\nEmail: $email \n\nMessage: $message";
        $headers = 'From: ' .' <'.$emailTo.'>' . "\r\n" . 'Reply-To: ' . $email;

        $mail = mail($emailTo, $subject, $body, $headers);

        if($mail) {
            // set our boolean completion value to TRUE
            $emailSent = true;
            echo "success";
            exit;
        }
    }
    echo "error";
    exit;
    }
}

minigoMailHandler();