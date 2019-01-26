<?php
// contact form
$website = 'Peninsula Hearing Care website';
$salesemail = 'info@peninsulahearingcare.co.uk';
if ($local) $salesemail = 'craig@optimalworks.net';

// ________________________________________________________
// fetches a GET variable
function get($var, $default='', $maxlength=9999) {
	$v = (isset($_GET[$var]) ? $_GET[$var] : '');
	return cleanvar(strlen($v) > 0 && strlen($v) <= $maxlength ? $v : $default);
}


// fetches a POST variable
function post($var, $default='', $maxlength=9999) {
	$v = (isset($_POST[$var]) ? $_POST[$var] : '');
	return cleanvar(strlen($v) > 0 && strlen($v) <= $maxlength ? $v : $default);
}


// clean a form variable
function cleanvar($v) {
	$v = (string) $v;
	if (get_magic_quotes_gpc()) $v = stripslashes($v);
	$v = trim($v);
	$v = str_replace("\r", '', $v);
	$v = preg_replace('/[ \t\f]+/', ' ', $v);
	$v = htmlentities($v);
	do {
		$ov = $v;
		$v = str_replace("\n\n", "\n", $v);
	} while ($v != $ov);
	return $v;
}


// returns valid email address (checks for spam attempt)
function emailcheck($e) {
	$e = strtolower($e);
	if ($e != '' && (preg_match('/^.+@[a-z0-9]+([_\.\-]{0,1}[a-z0-9]+)*([\.]{1}[a-z0-9]+)+$/', $e) != 1 || strpos($e, '\n') !== false || strpos($e, 'cc:') !== false)) $e = '';
	return $e;
}


// get microtime (seconds integer)
function microtime_int() {
   list($usec, $sec) = explode(" ", microtime());
   return ((int) $sec);
}


// encode
function encode($value) {
	$value = html_entity_decode(strval($value));
	$ip = $_SERVER['REMOTE_ADDR'];
	$ip = preg_replace('/\D/', '', $ip);
	if ($ip == '') $ip = '139999205';
	$ret = '';
	for ($i = 0; $i < strlen($value); $i++) {
		$c = ord(substr($value, $i, 1));
		$ic = substr($ip, $i % strlen($ip), 1) + $i;
		$ret .= chr($c ^ $ic);
	}
	return htmlentities($ret);
}

// ________________________________________________________
// parse form
$success = false;
$error = '';

// contact
$name = post('name', '', 80);
$telephone = post('telephone', '', 80);
$email = emailcheck(post('email', '', 80));
$address = post('address', '', 300);
$query = post('query', '', 1000);

// check posted form
if (post('submit') != '') {

	// data validation
	if ($name == '') $error .= 'name, ';
	if ($telephone == '' && $email == '') $error .= 'telephone number or email address, ';
	if (strlen($error) > 2) $error = substr($error, 0, strlen($error)-2);

	// spam validation
	$spam_error = 'details again and press submit in a few seconds. A technical error occurred';

	// rogue GET values [rg]
	if ($error == '' && count($_GET) > 0) $error = $spam_error . ' [rg]';

	// rogue POST values [rp]
	if ($error == '') {
		$valid = '[submit][key][name][telephone][email][address][query]';
		foreach ($_POST as $key => $value) if (strpos($valid, "[$key]") === false) $error = $spam_error . ' [rp]';
	}

	// user agent [ua], referrer [br], link check [lc], and key check [kc]
	if ($error == '') {
		if (!isset($_SERVER['HTTP_USER_AGENT']) || trim($_SERVER['HTTP_USER_AGENT']) == '') $error = $spam_error . ' [ua]';
		if (!isset($_SERVER['HTTP_REFERER']) || $_SERVER['HTTP_REFERER'] != 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']) $error = $spam_error . ' [br]';

		$l = 'http';
		$lc = substr_count($name, $l) + substr_count($telephone, $l) + substr_count($address, $l) + substr_count($query, $l);
		if ($lc > 0) $error = $spam_error . ' [lc]';

		$key = post('key', '', 30);
		if ($key == '' || (microtime_int() - (int) preg_replace('/\D/', '', encode($key))) < 10) $error = $spam_error . ' [kc]';
	}

	if ($error != '') {

		// show error
		$p = strrpos($error, ',');
		if ($p !== false) $error = substr($error, 0, $p+1) . ' and ' . substr($error, $p+2);
		echo "<p class=\"error\">Please enter your $error.</p>\n";

	}
	else {

		// send email
		if ($email != '') $header = "From: $name <$email>\n";
		else $header = "From: $website <$salesemail>\n";
		$subject = "$name - $website enquiry";
		$body = 'enquiry date: ' . gmdate('l j F Y, H:i')."\n";

		$body .= "\nCONTACT DETAILS\n";
		$body .= "name     : $name\n";
		if ($telephone != '') $body .= "telephone: $telephone\n";
		if ($email != '') $body .= "email    : <$email>\n\n";
		if ($address != '') $body .= "address  :\n$address\n\n";
		if ($query != '') $body .= "query    :\n$query\n";

		$success = @mail($salesemail, $subject, $body, $header);

		if ($success) echo "<p>Thank you for your enquiry; we will contact you shortly.</p>\n";
		else {
			$error = "<p class=\"error\">Your details could not be sent at this time. Please try again shortly, or contact us at the address above.</p>\n";
			echo $error;
		}

		// write to log
		$eflog='logs/contact.txt';
		$res = 'The following email '.($success ? 'was successfully' : 'could NOT be')." sent\nto: $salesemail\n\nsubject  : $subject\n\n$body";
		$res .= str_repeat('_', 60)."\n\n";

		if ($fp=fopen($eflog, 'a')) {
			fwrite($fp, $res);
			fclose($fp);
		}

	}

}

// show form
if (!$success) {

	if ($error == '') echo '<p>Please contact us by telephone <a href="tel:+44-1626-879209">01626 879209</a>, email <a href="contact-devon-hearing-centre" class="email">info {at} peninsulahearingcare dot co dot uk</a>, or visit us in Teignmouth.</p><div id="map"></div><p>Alternatively, please complete our enquiry form and we will call you.</p>';

?>

<form id="enquiry" action="<?php echo $thispage; ?>" method="post">

<fieldset>
<legend>Appointment booking form</legend>
<input type="hidden" name="key" value="<?php echo encode(microtime_int()); ?>" />

<ol class="form">

<li>
	<p class="help">Please enter your name.</p>
	<label for="name">Name:</label>
	<input type="text" id="name" name="name" value="<?php echo $name; ?>" size="20" maxlength="80" class="inpmed" />
</li>

<li>
	<p class="help">Please enter your telephone number.</p>
	<label for="telephone">Telephone:</label>
	<input type="text" id="telephone" name="telephone" value="<?php echo $telephone; ?>" size="20" maxlength="20" class="inpmed" />
</li>

<li>
	<p class="help">Please enter your email address.</p>
	<label for="email">Email:</label>
	<input type="text" id="email" name="email" value="<?php echo $email; ?>" size="20" maxlength="80" class="inpmed" />
</li>

<li>
	<p class="help">Please enter your address.</p>
	<label for="address">Address:</label>
	<textarea id="address" name="address" rows="3" cols="20"><?php echo $address; ?></textarea>
</li>

<li>
	<p class="help">Please enter your questions or comments.</p>
	<label for="query">Questions:</label>
	<textarea id="query" name="query" rows="3" cols="20"><?php echo $query; ?></textarea>
</li>

<li class="button">
	<input type="submit" name="submit" value="Send enquiry" class="button" />
</li>
</ol>

</fieldset>

</form>
<?php
}
?>
