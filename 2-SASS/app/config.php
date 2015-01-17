<?php


//
// Mailing list settings
// --------------------------------------------------------------------------------------------

// Set to true if you want to use Mailchimp to collect addresses. Otherwise, set to false.
$use_Mailchimp = false;

// Fill in you API Key here if the above option is true
$mailchimp_API_Key = 'abc123abc123abc123abc123abc123-us1';

// The ID of the mailchimp list where you want to save the contacts
$mailchimp_list_ID = 'b1234346';


// The emails are saved to this file if not using Mailchimp. Use a random name that can't be easily guessed.
$maillist_file = 'mail-list_FJdfjfk4FGeWR.txt';



//
// Contact form settings
// -------------------------------------------------------------------------------------------

// This is the email address where you'll receive the contact form messages
$target_address = 'minigo@example.com';

// Prefix for the email subject. Useful for filtering mail.
$subject_prefix = 'MiniGo message from - ';
?>