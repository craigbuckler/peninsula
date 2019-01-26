	</div>
	<!-- /content -->

</div>
<!-- /page -->

<!-- footer -->
<div id="footer"><div class="inner">

	<div class="main">

		<p class="noprint">[[<?php
				// menu links
				$ml = '';
				foreach($menuMain as $m) {
					if ($ml != '') $ml .= ' | ';
					$ml .= ($m->Active ? '<strong>' . $m->Text . '</strong>' : '<a href="' . $m->Link . '" title="' . $m->Title . '">' . $m->Text . '</a>');
				}
				echo $ml;
		?>]]</p>

		<p>01626 879 209 | <a href="[[<?php echo $page['contact']; ?>]]" class="email">info {at} peninsulahearingcare dot co dot uk</a></p>

		<p>Registered office: 46 Hyde Road, Paignton, Devon TQ4 5BY</p>

		<p>&copy; Copyright <?php echo date('Y'); ?> [[COMP]] Ltd, company number 7353730</p>

	</div>

	<div class="second">

		<p><a href="https://www.optimalworks.net/">an OptimalWorks website</a></p>

		<p>All pages are accessible and printer-friendly.</p>

	</div>

</div></div>

<!-- script -->
[[<?php
// include JavaScript
$js = '';

if ($local) {
	$script = array('owl', 'owl_css', 'owl_dom', 'owl_event', 'owl_image', 'main');
	foreach($script as $file) $js .= "<script type=\"text/javascript\" src=\"script/$file.js\"></script>\n";
}
else {
	$js .= '<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>'."\n".'<script type="text/javascript" src="script/peninsula.js"></script>';
}
echo $js;
?>]]

</body>
</html>
