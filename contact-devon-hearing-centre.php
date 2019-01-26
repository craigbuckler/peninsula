<?php require_once('tacs/tacs.php'); ?>

<!-- page setup variables -->
[[PAGETITLE = 'Contact us or make a hearing test appointment']]
[[PAGEDESC = 'Contact Peninsula Hearing Care to book a free hearing test or for deafness and hearing aid advice.']]
[[PAGEKEYS = 'contact, visit, phone, telephone, email, e-mail, fax, facsimile, appointment, booking']]
[[PAGETOPIC = 'contact Devon hearing aid centre']]

[[MENUACTIVE = 'contact']]
[[MAP = true]]

<!-- include header -->
[["template/pagebegin.php"]]

<div class="main">

	<h1>Contact [[COMP]]</h1>

	<!-- include contact page -->
	[["template/contact.php"]]

  <p>[[COMP]] operates a strict <a href="privacy-policy">privacy policy</a> to protect your personal information.</p>

</div>

<div class="second">

	<img id="teignmouth" class="imgmain" src="images/main/teignmouth.png" width="266" height="266" alt="Teignmouth" />

	[["template/vcard.php"]]

	<blockquote>
		<p>You have spent so much time and caring to get my hearing as near to normal as possible. I shall be spreading word of you to all my friends.</p>
		<p class="cite">Mrs M, Dawlish</p>
	</blockquote>

	[["template/organisations.php"]]

</div>

<!-- include footer -->
[["template/pageend.php"]]