<?php 
	$name = $_POST['name'];
	$email = $_POST['email'];
	$msg = $_POST['msg'];
	
	$from = 'Contact';
	$to = 'ali.munroe@knights.ucf.edu';
	$subject = 'Message from Portfolio';
	$body = "From: $name \n Email: $email\n Message \n $message";
	
	
	if (mail ($to, $subject, $body, $from)) {
		echo('<p>Thank you! I will be in touch soon.</p>');
	}
	else {echo ('<p>Sorry, there was an error sending your email.');}

?>