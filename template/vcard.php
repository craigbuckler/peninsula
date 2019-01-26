<div class="vcard">
	<p><a class="fn org url" href="http://www.peninsula-hearing-care.co.uk/" title="www.peninsula-hearing-care.co.uk">[[COMP]]</a></p>
	<ol class="adr">
		<li class="street-address">19 Station Road</li>
		<li class="locality">Teignmouth</li>
		<li class="region">Devon</li>
		<li class="postal-code">TQ14 8PE</li>
	</ol>
	<dl class="tel">
		<dt class="type" title="telephone">tel:</dt>
		<dd class="value" title="telephone">01626 879 209</dd>
	</dl>
	<dl>
		<dt>email:</dt>
		<dd><a href="[[<?php echo $page['contact']; ?>]]" class="email" title="email">info {at} peninsulahearingcare dot co dot uk</a></dd>
	</dl>
</div>

<p><a href="downloads/peninsula.vcf" class="add" title="vCard address file">add to address book</a></p>

[[<?php
	if ($MENUACTIVE != 'contact') echo '<p><a href="' . $page['contact'] . '" class="contact">use our contact form</a></p>';
?>]]