<?php
// Peninsula Hearing Care template
// (C) Optimalworks Ltd - http://www.optimalworks.net/

// runtime variables
date_default_timezone_set('Europe/London');
$host = $_SERVER['HTTP_HOST'];
$thispage = 'http://'.$host.$_SERVER['REQUEST_URI'];
$encpage = urlencode($thispage);
$local = (strpos($host , '.co') === false);

// redirect .php files
$newpage = str_replace('.php', '', $thispage);
if ($newpage != $thispage) {
	header('HTTP/1.1 301 Moved Permanently');
	header("Location: $newpage");
}

?>[[<?php

// render variables
date_default_timezone_set('Europe/London');
$host = $_SERVER['HTTP_HOST'];
$thispage = 'http://'.$host.$_SERVER['REQUEST_URI'];
$local = (strpos($host , '.co') === false);
$home = ($local ? '/peninsula/' : '/');

$COMP = 'Peninsula Hearing Care';
$COMPANY = 'Peninsula Hearing Care, Devon hearing aids';

?>]]<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="content-type" content="text/html;charset=iso-8859-1" />
<meta http-equiv="content-language" content="en" /><meta name="language" content="en" />

<title>[[PAGETITLE]] | [[COMPANY]]</title>

<meta name="description" content="[[PAGEDESC]]" />
<meta name="keywords" content="[[PAGEKEYS]], hearing, hearing aid, hearing aids, hearing test, hearing loss, hard of hearing, deaf, deafness, ear, ears, sound, care, health, impaired, treatment, audiologist, audiology, free advice, help, shop, buy, cheap, discount, inexpensive, price, devon, exeter, torquay, paignton, newton abbot, exmouth" />
<meta name="page-topic" content="[[PAGETOPIC]]" />
<meta name="audience" content="all" />
<meta name="distribution" content="global" />
<meta name="author" content="[[COMPANY]]" />
<meta name="publisher" content="Optimalworks Ltd, http://www.optimalworks.net/" />
<meta name="owner" content="[[COMP]]" />
<meta name="copyright" content="[[COMP]]" />
<meta name="robots" content="index,follow" />
<meta name="revisit-after" content="14 days" />
<meta http-equiv="pics-label" content='(pics-1.1 "http://www.icra.org/ratingsv02.html" l gen true for "http://[[host]]/" r (cz 1 lz 1 nz 1 oz 1 vz 1) "http://www.rsac.org/ratingsv01.html" l gen true for "http://[[host]]/" r (n 0 s 0 v 0 l 0))' />

<!-- stylesheets -->
<link type="text/css" rel="stylesheet" media="screen, handheld, projection, tv" href="styles/screen.css" />
<link type="text/css" rel="stylesheet" media="print" href="styles/print.css" />

<!-- favicon -->
<link rel="shortcut icon" href="favicon.ico" />

</head>
<body id="[[MENUACTIVE]]-page">

<!-- include menu functions -->
[["template/menu.php"]]

<!-- outer page -->
<div id="page">

	<!-- header -->
	<div id="header">

		<!-- telephone -->
		<p><a href="tel:+44-1626-879209" style="text-decoration:none">01626 879209</a></p>

		<!-- logo -->
		<a href="[[home]]"><img id="logo" src="images/peninsiula-hearing-care.png" width="292" height="108" alt="Peninsula Hearing Care" title="Peninsula Hearing Aids and Care Services" /></a>

		<!-- menu -->
		<ul>
			[[<?php
			// main menu links
			foreach($menuMain as $m) {
				if (!$m->Hide) echo '<li id="' . $m->ID . '">' . $m->CreateLink() . "</li>\n";
			}
			?>]]
		</ul>

	</div>

	<!-- main content -->
	<div id="content">
