<?php
// requested URL
$addr=strtolower($_SERVER['REQUEST_URI']);
$url = '';

// redirects
$redir = array(
	'service' => 'devon-hearing-aid-service',
	'help' => 'hearing-aid-service',
	'test' => 'hearing-aid-service',
	'about' => 'hearing-aids-devon',
	'us' => 'hearing-aids-devon',
	'shop' => 'hearing-aids-devon',
	'centre' => 'hearing-aids-devon',
	'center' => 'hearing-aids-devon',
	'contact' => 'contact-devon-hearing-centre',
	'call' => 'contact-devon-hearing-centre',
	'mail' => 'contact-devon-hearing-centre',
	'visit' => 'contact-devon-hearing-centre'
);
if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'bot') === false && strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'google') === false) {
	foreach ($redir as $pold => $pnew) if (strpos($addr, $pold) !== false) $url = $pnew;
}

if ($url !== '') {

	// redirect
	header('HTTP/1.1 301 Moved Permanently');
	header('Location: ' . $url);

}
else {

	// show error page
	$host = $_SERVER['HTTP_HOST'];
	$local = (strpos($host , '.co') === false);
	$eurl = 'http://' . $host . ($local ? '/peninsula' : '') . '/error404';

	$fcont = file_get_contents($eurl);
	if ($fcont !== false) {
		header('HTTP/1.0 404 Not Found');
		echo $fcont;
	}
	else header('Location: ' . $eurl);

}
?>