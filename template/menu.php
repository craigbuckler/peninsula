[[<?php

// define menu in XML
$menuXML = <<<XML
<?xml version='1.0' standalone='yes'?>
<menu>
	<item id="home" text="Home" link="$home" title="Hearing aid help &amp;amp; advice" key="h" />
	<item id="service" text="Service" link="hearing-aid-service" title="Hearing tests, products &amp;amp; prices" key="s" />
	<item id="about" text="About" link="hearing-aids-devon" title="Who we are &amp;amp; how we can help" key="a" />
  <item id="privacy" text="Privacy" link="privacy-policy" title="We keep your personal details private" key="p" hide="true" />
	<item id="contact" text="Contact" link="contact-devon-hearing-centre" title="Visit or call our Devon practice" key="c" />
</menu>
XML;

$menu = new SimpleXMLElement($menuXML);

// define the menus
$page = array();
$menuMain = array();

// main menu items
foreach ($menu->item as $item) {

	// main menu
	$active = ($item['id'] == $MENUACTIVE);
	$menuMain[] = new Menu($item['id'], $item['text'], $item['link'], $item['title'], $item['key'], $item['hide'], $active);
	$page[(string) $item['id']] = (string) $item['link'];

}


// menu item
class Menu
{
	public $ID, $Text, $Link, $Title, $Key, $Active;

	// define a menu
	public function __construct($id, $text, $link, $title = '', $key = '', $hide = false, $active = false) {
		$this->ID = (string) $id;
		$this->Text = preg_replace('/^(.+):(.+)$/', '<strong>$1</strong>$2', (string) $text);
		$this->Link = (string) $link;
		$this->Title = (string) $title;
		$this->Key = (string) $key;
    $this->Hide = (bool) $hide;
		$this->Active = (bool) $active;
	}

	// return an HTML link
	public function CreateLink() {
		$mlink = "<a href=\"$this->Link\"";
		if ($this->Key != '') $mlink .= " accesskey=\"$this->Key\"";
		$mlink .= "><strong>$this->Text</strong> ";
		if ($this->Title != '') $mlink .= $this->Title;
		$mlink .= '</a>';
		return $mlink;
	}
}
?>]]