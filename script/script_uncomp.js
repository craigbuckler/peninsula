/*	---------------------------------------------

	owl: Optimalworks Library
	(c) optimalworks.net

	core components:
		owl
		owl.RegEx
		owl.Number
		owl.String
		owl.Property

	--------------------------------------------- */

if (!owl) {
var owl = {};
owl.Version = 0.1;


/*	---------------------------------------------

	owl.Browser

	--------------------------------------------- */
owl.UserAgent = navigator.userAgent.toLowerCase();
owl.Browser = {
	IE: /msie/.test(owl.UserAgent) && !/opera/.test(owl.UserAgent),
	Mozilla: /mozilla/.test(owl.UserAgent) && !/(compatible|webkit)/.test(owl.UserAgent),
	Opera: /opera/.test(owl.UserAgent),
	Safari: /webkit/.test(owl.UserAgent),
	Konqueror: /konqueror/.test(owl.UserAgent)
};
owl.Browser.Version = owl.UserAgent.replace(/^.+[ox|ra|on|or][\/: ]/, "");
if (owl.Browser.Version.indexOf("msie") >= 0) owl.Browser.Version = owl.Browser.Version.replace(/^.+[ie][\/: ]/, "");
owl.Browser.Version = owl.Browser.Version.replace(/([^\d.].+$)/, "");
owl.Browser.VerNum = parseFloat(owl.Browser.Version);


/*	---------------------------------------------

	owl.Number

	--------------------------------------------- */
owl.Number = function() {

	var reNumeric = /[^0-9-.]/g;

	// to integer
	function toInt(obj) {
		var str = String(obj);
		str = str.replace(reNumeric, "");
		var ret = parseInt(str, 10);
		return (isNaN(ret) ? 0 : ret);
	}

	// sign - returns -1, 0 or 1
	function Sign(num) {
		if (isNaN(num)) num = 0;
		return (Math.min(1, Math.max(-1, num)));
	}

	// public
	return {
		toInt: toInt,
		Sign: Sign
	};

}();


/*	---------------------------------------------

	owl.String

	--------------------------------------------- */
owl.String = function() {

	var reTrim = /^\s*|\s*$/g;
	var reClean = /[^\w|\s|@|&|.|,|!|%|(|)|+|-]/g;
	var reWhitespace = /[_|\s]+/g;

	// string trim
	function Trim(str) { return String(str).replace(reTrim, ""); }

	// string clean
	function Clean(str) { return Trim(String(str).replace(reClean, "").replace(reWhitespace, " ")); }

	// string pad
	function Pad(str, length, chr) {
		str = String(str);
		length = owl.Number.toInt(length);
		if (typeof chr == 'undefined') chr = " ";
		else {
			chr = String(chr);
			if (chr.length < 1) chr = " ";
		}
		while (str.length < length) str = chr + str;
		return str;
	}

	// string format - replaces %0, %1 ... %n with values in the params array|string
	function Format(str, params) {
		if (typeof params == 'string') params = [params];
		if (params && params.length) {
			for (var p = 0, pl = params.length; p < pl; p++) str = str.replace(new RegExp("(^|[^%])%"+p+"([^0-9]|$)", "g"), "$1"+params[p]+"$2");
		}
		return str;
	}

	// public methods
	return {
		Trim: Trim,
		Clean: Clean,
		Pad: Pad,
		Format: Format
	};

}();


/*	---------------------------------------------

	owl.Array

	--------------------------------------------- */
if (owl && !owl.Array) owl.Array = function() {

	// is array
	function Is(array) { return !!(array && array.constructor == Array); }

	// push
	function Push(array, element) { array[array.length] = element; }

	// pop
	function Pop(array) {
		var ret = null;
		if (array.length > 0) {
			ret = array[array.length-1];
			array.length--;
		}
		return ret;
	}

	// make (array arr, default value/array def)
	function Make(arr, def) {
		return (arr ? (Is(arr) ? arr : [arr]) : (typeof def == "undefined" ? [] : (Is(def) ? def : [def])));
	}

	// public methods
	return {
		Is: Is,
		Push: Push,
		Pop: Pop,
		Make: Make
	};

}();


/*	---------------------------------------------

	owl.Each

	--------------------------------------------- */
owl.Each = function (obj, fn) {
	if (obj.length) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
	else for (var p in obj) if (fn(obj[p], p) === false) break;
};


/*	---------------------------------------------

	owl.Property

	--------------------------------------------- */
owl.Property = function() {

	// add owl namespace to element
	function owlNamespace(element) {
		if (!element.owlP) {
			element.owlP = {};
			element.owlP.length = 0;
		}
	}

	// add value to owl namespace (for one or more elements)
	function Set(element, name, value) {
		owl.Each(owl.Array.Make(element), function(e) {
			owlNamespace(e);
			e.owlP[name] = value;
			e.owlP.length++;
		});
	}

	// get value from owl namespace
	function Get(element, name) {
		return (Exists(element, name) ? element.owlP[name] : null);
	}

	// does value exist?
	function Exists(element, name) {
		return (element && element.owlP && typeof element.owlP[name] != "undefined");
	}

	// remove value and namespace if required
	function Delete(element, name) {
		owl.Each(owl.Array.Make(element), function(e) {
			if (e.owlP && e.owlP[name]) {
				delete e.owlP[name];
				e.owlP.length--;
				if (e.owlP.length == 0) e.owlP = null;
			}
		});
	}

	// public methods
	return {
		Set: Set,
		Get: Get,
		Exists: Exists,
		Delete: Delete
	};

}();


/*	---------------------------------------------

	owl.Object

	--------------------------------------------- */
owl.Object = function() {

	// property/method exists
	function Exists(object, item) { return (typeof object[item] != 'undefined'); }

	// property exists
	function PropertyExists(object, item) { var type = typeof(object[item]); return (type != 'undefined' && type != 'function'); }

	// method exists
	function MethodExists(object, item) { return (typeof object[item] == 'function'); }

	// serialize object properties (to JSON)
	function Serialize(obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {

			// simple data type
			if (t == "string") obj = '"'+obj+'"';
			return String(obj);

		}
		else {

			// recurse array or object
			var n, v, json = [], arr = owl.Array.Is(obj);

			for (n in obj) {
				v = obj[n]; t = typeof(v);

				if (t == "string") v = '"'+v+'"';
				else if (t == "object" && v !== null) v = owl.Object.Serialize(v);

				json.push((arr ? "" : '"' + n + '":') + String(v));
			}

			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	}

	// return a deserialize object from a JSON string
	function DeSerialize(serial) {
		if (serial === "") serial = '""';
		eval("var ret = " + serial + ";");
		return ret;
	}

	// public methods
	return {
		Exists: Exists,
		PropertyExists: PropertyExists,
		MethodExists: MethodExists,
		Serialize: Serialize,
		DeSerialize: DeSerialize
	};

}();


}/*	---------------------------------------------

	owl.Css

	--------------------------------------------- */
if (owl && !owl.Css) owl.Css = function() {


	// returns true if class applied to passed elements
	function ClassExists(elements, name) {
		var cfound = true;
		if (name) owl.Each(owl.Array.Make(elements), function(e) { var cn = " "+e.className+" "; cfound = (cn.indexOf(" "+name+" ") >= 0); return cfound; });
		return cfound;
	}


	// apply class to all elements
	function ClassApply(elements, name) {
		owl.Each(owl.Array.Make(elements),
			function(e) {
				var cn = " "+e.className+" ";
				if (cn.indexOf(" "+name+" ") < 0) {
					cn += name;
					e.className = owl.String.Trim(cn);
				}
			}
		);
	}


	// remove class from elements (pass name of "" to remove all classes)
	function ClassRemove(elements, name) {
		owl.Each(owl.Array.Make(elements),
			function(e) {
				var cn = "";
				if (name) {
					cn = " "+e.className+" ";
					cn = owl.String.Trim(cn.replace(new RegExp(" "+name+" ", "gi"), " "));
				}
				e.className = cn;
			}
		);
	}


	// set elements opacity (0 to 100). Set autoHide to false to keep visibility
	// IE5.5/6.0 elements require hasLayout and often a background colour
	function Opacity(elements, oVal, autoHide) {
		oVal = Math.min(Math.max(oVal, 0), 99.999999);
		var oValFrac = oVal / 100;
		owl.Each(owl.Array.Make(elements),
			function(e) {
				if (autoHide !== false) {
					if (e.style.visibility == "hidden") { if (oVal > 0) e.style.visibility = "visible"; }
					else { if (oVal == 0) e.style.visibility = "hidden"; }
				}
				e.style.opacity = oValFrac;
				e.style.MozOpacity = oValFrac;
				e.style.filter = "alpha(opacity:"+oVal+")";
				e.style.KHTMLOpacity = oValFrac;
			}
		);
	}


	// fetch the computed style of an element, e.g. element, "width"
	function ComputedStyle(element, rule) {
		var value = "";
		if (element) {
			if (document.defaultView && document.defaultView.getComputedStyle) value = document.defaultView.getComputedStyle(element, "").getPropertyValue(rule);
			else if (element.currentStyle) {
				rule = rule.replace(/\-(\w)/g, function(m,c) { return c.toUpperCase(); });
				value = element.currentStyle[rule];
			}
		}
		return value;
	}


	return {
		ClassExists: ClassExists,
		ClassApply: ClassApply,
		ClassRemove: ClassRemove,
		Opacity: Opacity,
		ComputedStyle: ComputedStyle
	};

}();


// prevent IE CSS background flickering
if (owl && owl.Browser && owl.Browser.IE && Math.floor(owl.Browser.VerNum) == 6) {
	try { document.execCommand("BackgroundImageCache", false, true); }
	catch(e) {};
}/*	---------------------------------------------

	owl.Dom

	--------------------------------------------- */
if (owl && owl.Css && !owl.Dom && document.getElementById && document.getElementsByTagName) owl.Dom = function() {

	// node types
	var ElementNode = 1;
	var AttributeNode = 2;
	var TextNode = 3;
	var CommentNode = 8;

	// regular expressions
	var CSSclean = /[^\w|\s|\-|#|\.|,|\[|\]|=|~|!|*]/g;
	var CSSwhitespace = /\s+/g;
	var reTag = /^[^#|\.|\[]*/;
	var reID = /#[^#|\.|\[]+/;
	var reClass = /\.[^#|\.|\[]+/;
	var reAttribute = /\[(.+)\]/;
	var reAttrExp = /([~|!|*]*=)/;
	var reAttrName = /(^[^=|~|!|*])+/;

	// array defaults
	var $A = owl.Array, doc = [document];

	// find a node collection
	function Get(css, nodes) {

		nodes = $A.Make(nodes, doc);
		css = owl.String.Trim(String(css).replace(CSSclean, "").replace(CSSwhitespace, " "));
		var allNodes = [], args = css.split(","), arg, exp, a, al, e, el;

		// all arguments
		for (a = 0, al = args.length; a < al; a++) {
			arg = owl.String.Trim(args[a]);
			var sNodes = nodes.slice();

			// all argument elements
			exp = arg.split(" ");
			for (e = 0, el = exp.length; e < el; e++) if (nodes.length > 0) sNodes = parseGet(exp[e], sNodes);
			owl.Each(sNodes, function(s) { $A.Push(allNodes, s); });
		}

		return allNodes;
	}

	// parse Get expression
	function parseGet(exp, nodes) {

		var nCollect = [], subnodes, tempnodes, n, nl, s, sl, t, tl;
		var nType = { Tag: '', ID: '', Class: '', AttribCheck: function() { return true; } };
		nType.Tag = reTag.exec(exp); nType.Tag = (nType.Tag ? nType.Tag[0].toLowerCase() : '*'); if (nType.Tag == "") nType.Tag = "*";
		nType.ID = reID.exec(exp); nType.ID = (nType.ID ? nType.ID[0].substr(1) : '');
		nType.Class = reClass.exec(exp); nType.Class = (nType.Class ? nType.Class[0].substr(1) : '');

		// attributes
		var attr = reAttribute.exec(exp);
		if (attr) {
			attr = attr[1];
			var aName, aValue = null, aExp = reAttrExp.exec(attr);
			aExp = (aExp ? aExp[1] : null);
			if (aExp) {
				var p = attr.indexOf(aExp);
				aName = attr.substr(0, p);
				aValue = attr.substr(p+aExp.length);
			}
			else aName = attr;

			nType.AttribCheck = function(node) {
				var a;
				switch (aName) {
					case "class": a = node.className; break;
					case "for": a = node.htmlFor; break;
					default: a = node.getAttribute(aName); break;
				}
				a = (a ? a : "");
				return (
					(a == '' && (!aExp || aExp == '!=')) || (!aExp || (
						(aExp == '=' && a == aValue) ||
						(aExp == '!=' && a != aValue) ||
						(aExp == '*=' && a.indexOf(aValue) >= 0) ||
						(aExp == '~=' && (" "+a+" ").indexOf(" "+aValue+" ") >= 0)
					))
				);
			};
		}

		// do all roots
		for (n = 0, nl = nodes.length; n < nl; n++) {

			subnodes = [];

			// ID passed
			if (nType.ID) {
				tempnodes = document.getElementById(nType.ID);
				if (tempnodes && (nType.Tag == '*' || tempnodes.nodeName.toLowerCase() == nType.Tag) && (!nType.Class || owl.Css.ClassExists(tempnodes, nType.Class)) && nType.AttribCheck(tempnodes) ) subnodes[0] = tempnodes;
			}
			else {
				// other types
				var checkNode = function(node) {
					return (
						(nType.Tag == "*" || node.nodeName.toLowerCase() == nType.Tag) &&
						(nType.Class == "" || owl.Css.ClassExists(node, nType.Class)) &&
						nType.AttribCheck(node)
					);
				};
				if (nType.Tag == "*") subnodes = Descendents(nodes[n], 0, checkNode);
				else {
					tempnodes = nodes[n].getElementsByTagName(nType.Tag);
					for (t = 0, tl = tempnodes.length; t < tl; t++) if (checkNode(tempnodes[t])) subnodes[subnodes.length] = tempnodes[t];
				}
			}

			// add subnodes to collection
			for (s = 0, sl = subnodes.length; s < sl; s++) nCollect[nCollect.length] = subnodes[s];
		}

		return nCollect;
	}


	// returns all descendent elements (to optional level n, e.g. 1 = immediate children and condition function)
	function Descendents(element, maxLevel, condition) {
		var recurseNodes = function(eNodes, level) {
			var cNodes = [], e, el, node;
			if (!level) level = 1;
			for (e = 0, el = eNodes.childNodes.length; e < el; e++) {
				node = eNodes.childNodes[e];
				if (node.nodeType == ElementNode && node.nodeName != "!") {
					if (!condition || condition(node)) cNodes[cNodes.length] = node;
					if (eNodes.childNodes.length > 0 && (!maxLevel || level < maxLevel)) cNodes = cNodes.concat(recurseNodes(node, level++));
				}
			}
			return cNodes;
		};

		element = $A.Make(element, doc);
		var nodes = [];
		owl.Each(element, function(e) { nodes = nodes.concat(recurseNodes(e)); });
		return nodes;
	}


	// find a node by type and work up parents until found
	function Ancestors(nodes, nodename) {
		var ret = [];
		nodename = (nodename.toLowerCase() || 'div');
		owl.Each($A.Make(nodes), function(n, i) {
			while (n.nodeName.toLowerCase() != nodename && n.parentNode) n = n.parentNode;
			ret[i] = (n.nodeName.toLowerCase() == nodename ? n : null);
		});
		if (!owl.Array.Is(nodes)) ret = ret[0];
		return ret;
	}


	// clones nodes (from, to, move nodes, clear original children)
	function Clone(nFrom, nTo, move, clear) {
		nFrom = $A.Make(nFrom, doc); nTo = $A.Make(nTo, doc);
		owl.Each(nTo, function(node, i) {
			if (clear) RemoveChildren(node);
			var nf = Math.min(i, nFrom.length-1);
			for (var t = 0, tl = nFrom[nf].childNodes.length; t < tl; t++) node.appendChild(nFrom[nf].childNodes[t].cloneNode(true));
			if (move) RemoveChildren(nFrom[nf]);
			else RemoveIDs(node);
		});
	}


	// remove child node IDs
	function RemoveIDs(nodes) {
		owl.Each($A.Make(nodes, doc), function(n) { Descendents(n, null, function(e) { if (e.id) e.removeAttribute('id'); return true; }) });
	}


	// remove child nodes
	function RemoveChildren(nodes) {
		owl.Each($A.Make(nodes, doc), function(n) { while (n.lastChild) n.removeChild(n.lastChild); });
	}


	// find text node (private)
	function FindTextNode(node) {
		var found = false;
		for (var c = 0, cl = node.childNodes.length; c < cl && !found; c++) found = ( node.childNodes[c].nodeType == TextNode ? node.childNodes[c] : FindTextNode(node.childNodes[c]) );
		return found;
	}


	// get or set text
	function Text(nodes, str) {
		var rep = (typeof str != 'undefined');
		str = (rep ? (typeof str == 'string' ? [str] : str) : "");
		owl.Each($A.Make(nodes, doc), function(node, i) {
			var tn = FindTextNode(node);
			if (rep) {
				var newstr = str[Math.min(i, str.length-1)];
				if (tn) tn.nodeValue = newstr;
				else tn = node.appendChild(document.createTextNode(newstr));
			}
			else if (tn) str += (str == '' ? '' : "\n") + tn.nodeValue;
		});
		return (rep ? true : str);
	}


	return {
		ElementNode: ElementNode,
		AttributeNode: AttributeNode,
		TextNode: TextNode,
		CommentNode: CommentNode,
		Get: Get,
		Descendents: Descendents,
		Ancestors: Ancestors,
		Clone: Clone,
		RemoveIDs: RemoveIDs,
		RemoveChildren: RemoveChildren,
		Text: Text
	};

}();/*	---------------------------------------------

	owl.Event

	--------------------------------------------- */
if (owl && !owl.Event) {

	// define an event on one or more elements
	owl.Event = function(element, type, handler, priority) {

		element = owl.Array.Make(element, [window]);
		handler = (typeof handler == 'function' ? handler : null);
		priority = (priority || priority == 0 ? owl.Number.toInt(priority) : null);
		var regIndex = [];

		// add event(s)
		owl.Each(
			element,
			function(e) { regIndex[regIndex.length] = owl.EventRegister.Add(e, type, handler, priority); }
		);

		// detach event(s)
		this.Detach = function() {
			for (var e = 0, el = element.length; e < el; e++) owl.EventRegister.Detach(element[e], type, regIndex[e], true);
		};
	};


	/*	---------------------------------------------
		owl.EventRegister
		--------------------------------------------- */
	owl.EventRegister = function() {

		// element store
		var regElements = [], register = [], precedence = [], guid = 0, pReset = false;
		var ns = 'EventRegister';

		// create event
		function Add(element, type, handler, priority) {

			// existing event list
			var regEvents = owl.Property.Get(element, ns);
			if (!regEvents) {
				regEvents = {};
				regElements[regElements.length] = element;
			}

			// register new event type for element
			if (!regEvents[type]) {

				guid++;
				register[guid] = [];
				regEvents[type] = guid;
				owl.Property.Set(element, ns, regEvents);

				// define event
				var existingEvent = element["on"+type];
				if (existingEvent) new owl.Event(element, type, existingEvent);
				element["on"+type] = owl.EventRegister.Handler;

				// clean up event
				if (guid == 1) new owl.Event(window, "unload", owl.EventRegister.CleanUp, 1e+100);

			}

			// set handler
			var regIndex = regEvents[type];
			var funcIndex = register[regIndex].length;
			register[regIndex][funcIndex] = { Handler: handler, Priority: priority };

			// handler precedence
			SetPrecedence(element, type, regIndex);

			// return handler reference
			return { Reg: regIndex, Func: funcIndex };
		}

		// set handler priority order
		function SetPrecedence(element, type, regIndex) {
			var prec = [];
			for (var p = 0, pl = register[regIndex].length; p < pl; p++) {
				if (register[regIndex][p].Handler != null) prec[prec.length] = { Index: p, Priority: register[regIndex][p].Priority };
			}

			// sort by priority
			if (prec.length > 0) prec.sort(function(a, b) { return a.Priority - b.Priority; });
			else {
				// or remove event
				element["on"+type] = null;
				delete element.owlP[ns][type];
				prec = null;
			}

			precedence[regIndex] = prec;
			pReset = false;
		}

		// run all events
		function Handler(event) {
			var ret = true, e = new owl.EventInformation(this, event);
			if (e.Index && e.Index.Reg) {
				var prec = precedence[e.Index.Reg].slice();
				for (var p = 0, pl = prec.length; p < pl; p++) {
					e.Index.Func = prec[p].Index;
					if (e.AllowNext && register[e.Index.Reg][e.Index.Func].Handler) {
						ret &= (register[e.Index.Reg][e.Index.Func].Handler(e) !== false);
					}
				}
			}
			if (pReset) SetPrecedence(e.Element, e.Type, e.Index.Reg);
			return ret;
		}

		// detach event
		function Detach(element, type, index, forceReset) {
			register[index.Reg][index.Func].Handler = null;
			if (forceReset) SetPrecedence(element, type, index.Reg);
			else pReset = true;
		}

		// cleanup event
		function CleanUp() {
			for (var e = 0, el = regElements.length, em = regElements[0]; e < el; em = regElements[++e]) { // all elements
				for (var h in owl.Property.Get(em, ns)) em["on"+h] = null;
				owl.Property.Delete(em, ns);
			}
			regElements = null; register = null; precedence = null;
		}

		// public values
		return {
			Namespace: ns,
			Add: Add,
			Handler: Handler,
			Detach: Detach,
			CleanUp: CleanUp
		};

	}();


	/*	---------------------------------------------
	owl.EventInformation
	--------------------------------------------- */
	owl.EventInformation = function(element, event) {
		this.Element = element;
		this.Event = (event ? event : window.event);
		if (this.Event) {
			this.Type = this.Event.type.toLowerCase();
			this.Target = (this.Event.target ? this.Event.target : this.Event.srcElement);
			this.Index = { Reg: this.Element.owlP[owl.EventRegister.Namespace][this.Type], Func: null };
			this.AllowNext = true;
		}
	};

	// key press
	owl.EventInformation.prototype.Key = function() {
		if (!this.KeySet) {
			this.KeySet = { Pressed: '', Function: '', Shift: this.Event.shiftKey, Ctrl: this.Event.ctrlKey, Alt: this.Event.altKey };

			if (owl.EventKey.test(this.Type)) {
				var keyCode = this.Event.keyCode; // key pressed
				var charCode = (typeof this.Event.charCode != 'undefined' ? this.Event.charCode : null); // character returned (Firefox keypress)

				if (charCode > 0) this.KeySet.Pressed = String.fromCharCode(charCode);
				else {
					if (owl.EventCK[keyCode] && (charCode != null || keyCode < 32 || (this.Type != "keypress" || (!this.Shift && keyCode < 112 && keyCode != 35 && keyCode != 39 && keyCode != 45 && keyCode != 46)))) this.KeySet.Function = owl.EventCK[keyCode];
					else if (keyCode >= 32) this.KeySet.Pressed = String.fromCharCode(keyCode);
				}

			}
		}
		return this.KeySet;
	};

	// mouse event
	owl.EventInformation.prototype.Mouse = function() {
		if (!this.MouseSet) {
			this.MouseSet = { X: 0, Y: 0 };

			if (owl.EventMouse.test(this.Type)) {
				this.MouseSet.X = (this.Event.pageX ? this.Event.pageX : this.Event.clientX + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft));
				this.MouseSet.Y = (this.Event.pageY ? this.Event.pageY : this.Event.clientY + Math.max(document.documentElement.scrollTop, document.body.scrollTop));
			}
		}
		return this.MouseSet;
	};

	// detach event
	owl.EventInformation.prototype.Detach = function() {
		owl.EventRegister.Detach(this.Element, this.Type, this.Index);
	};

	// stop processing further events
	owl.EventInformation.prototype.StopHandlers = function() { this.AllowNext = false; };

	// stop propagation
	owl.EventInformation.prototype.StopPropagation = function() {
		if (this.Event.stopPropagation) this.Event.stopPropagation();
		this.Event.cancelBubble = true;
	};

	// stop default action
	owl.EventInformation.prototype.StopDefaultAction = function() {
		if (this.Event.preventDefault) this.Event.preventDefault();
		this.Event.returnValue = false;
	};

	// event settings
	owl.EventKey = /^key/i;
	owl.EventMouse = /mouse|click/i;
	owl.EventCK = []; owl.EventCK[8] = "backspace"; owl.EventCK[9] = "tab"; owl.EventCK[13] = "enter"; owl.EventCK[19] = "break"; owl.EventCK[27] = "esc"; owl.EventCK[33] = "pageup"; owl.EventCK[34] = "pagedown"; owl.EventCK[35] = "end"; owl.EventCK[36] = "home"; owl.EventCK[37] = "left"; owl.EventCK[38] = "up"; owl.EventCK[39] = "right"; owl.EventCK[40] = "down"; owl.EventCK[45] = "insert"; owl.EventCK[46] = "delete"; owl.EventCK[112] = "f1"; owl.EventCK[113] = "f2"; owl.EventCK[114] = "f3"; owl.EventCK[115] = "f4"; owl.EventCK[116] = "f5"; owl.EventCK[117] = "f6"; owl.EventCK[118] = "f7"; owl.EventCK[119] = "f8"; owl.EventCK[120] = "f9"; owl.EventCK[121] = "f10"; owl.EventCK[122] = "f11"; owl.EventCK[123] = "f12"; owl.EventCK[144] = "numlock"; owl.EventCK[145] = "scrolllock";

	// disable fast back
	if (history && history.navigationMode) history.navigationMode = "compatible";
}/*	---------------------------------------------

	owl.Image

	--------------------------------------------- */
if (owl && !owl.Image) owl.Image = function() {

	// load an image and run a callback function
	function Load(imgsrc, callback) {
		var img = new Image();
		img.src = imgsrc;
		if (callback) {
			if (img.complete) callback(img);
			else img.onload = function() { callback(img); };
		}
	}

	// load an alpha-transparent PNG in IE
	function IEpng(element, imgsrc, sizing) {
		if (owl.Browser.IE && owl.Browser.VerNum >= 5.5 && owl.Browser.VerNum < 7) {
			if (!sizing) sizing = "crop";
			owl.Each(owl.Array.Make(element), function(e) {
				if (e.nodeName.toLowerCase() == "img") e.src = "images/spacer.gif";
				e.style.backgroundImage = "none";
				e.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+imgsrc+"', sizingMethod='"+sizing+"')";
			});
		}
	}

	// public methods
	return {
		Load: Load,
		IEpng: IEpng
	};

}();/*
Peninsula Hearing Care JavaScript
(C) Optimalworks.net
*/

// setup
var ph = ph || {};

ph.Initialise = function() {

  ph.Setup = {

    // email address node
    EmailNode: "a.email",

    // contact form
    Contact: {
      Form: "#enquiry",
      ErrorClass: "error",
      Check: [
        { Field: "#name", Validate: ph.Validate.String, Req: true, Min: 1, Max: 80 },
        { Field: "#telephone", Validate: ph.Validate.String, Req: false, Min: 6, Max: 20, Additonal: function(f) {
          var ret = true;
          if (f == '') {
            var g = owl.Dom.Get("#email");
            if (g.length == 1) ret = ph.Validate.Email(g[0].value, true, 6, 80);
          }
          return ret;
        } },
        { Field: "#email", Validate: ph.Validate.Email, Req: false, Min: 6, Max: 80, Additonal: function(f) {
          var ret = true;
          if (f == '') {
            var g = owl.Dom.Get("#telephone");
            if (g.length == 1) ret = (owl.String.Trim(g[0].value).length >= 6);
          }
          return ret;
        } }
      ]
    },

    // Google Map
    Map: {
      Element: "#map",
      ActiveClass: "active",
      center: { lat: 50.5472179, lng: -3.4945563 },
      Zoom: 17,
      Type: "roadmap",
      Title: "Peninsula",
      API: 'AIzaSyBV8GzovNv6hkSD2E1mQ62JpxiTrH_F0Ng'
    },

    // Google Analytics ID
    Analytics: "UA-20463167-1"

  };

};


// ---------------------------------------------
// onload event
ph.Start = function() {
  ph.Initialise();
  ph.EmailParse();
  new ph.Validator(ph.Setup.Contact);
  ph.Map();
  ph.Analytics();

  // PNG replacement
  owl.Image.IEpng(owl.Dom.Get("#hearing-model"), "images/main/hidden-hearing-aid.png");
  owl.Image.IEpng(owl.Dom.Get("#hearing-aid"), "images/main/hearing-aid.png");
  owl.Image.IEpng(owl.Dom.Get("#laurie-mckenna"), "images/main/laurie-mckenna.png");
  owl.Image.IEpng(owl.Dom.Get("#teignmouth"), "images/main/teignmouth.png");
};
new owl.Event(window, "load", ph.Start, 0);


// ---------------------------------------------
// email replacement
ph.EmailParse = function() {
  owl.Each(owl.Dom.Get(ph.Setup.EmailNode), function(e) {
    if (e.firstChild) {
      var es = e.firstChild.nodeValue;
      es = es.replace(/dot/ig, ".");
      es = es.replace(/\{at\}/ig, "@");
      es = es.replace(/\s/g, "");
      e.href="mai"+'lto:'+es;
      owl.Dom.Text(e, es);
    }
  });
};


// ---------------------------------------------
// form validation
ph.Validator = function(setup) {

  var form = owl.Dom.Get(setup.Form);
  if (form.length == 1) {
    this.Form = form[0];
    this.ErrorClass = setup.ErrorClass;
    this.Fields = setup.Check;
    var T = this;
    new owl.Event(form, "submit", function(evt) { T.Check(evt); }, 0);
  }

};

// check form
ph.Validator.prototype.Check = function(evt) {

  var valid = true;
  var form = this.Form;
  var err = this.ErrorClass;

  // check all fields
  owl.Each(this.Fields, function(f) {
    var fNode = owl.Dom.Get(f.Field, form);
    if (fNode.length == 1) fNode = fNode[0];
    if (fNode && f.Validate) {
      var v = owl.String.Trim(fNode.value);
      if (v != fNode.value) fNode.value = v;
      var check = f.Validate(v, f.Req, f.Min, f.Max);
      if (f.Additonal) check &= f.Additonal(v);
      if (!check) {
        if (valid && fNode.select && fNode.focus) { fNode.select(); fNode.focus(); }
        owl.Css.ClassApply(fNode.parentNode, err);
        valid = false;
      }
      else owl.Css.ClassRemove(fNode.parentNode, err);
    }
  });

  if (!valid) {
    evt.StopDefaultAction();
    evt.StopHandlers();
  }

  return valid;

}


// ---------------------------------------------
// field checking
ph.Validate = function() {

  // string validation
  function String(str, req, min, max) { return !req || (str && (!min || str.length >= min) && (!max || str.length <= max)); }

  // email validation
  var reEmail = /^[^@]+@[a-z0-9]+([_\.\-]{0,1}[a-z0-9]+)*([\.]{1}[a-z0-9]+)+$/;
  function Email(str, req, min, max) {
    str = str.toLowerCase();
    var valid = (str != '' && (!min || str.length >= min) && (!max || str.length <= max) && (str.replace(reEmail, "") == ""));
    return (valid || (!req && str == ''));
  }

  return {
    String: String,
    Email: Email
  };

}();


// ---------------------------------------------
// Google Map
ph.Map = function() {

  var $C = ph.Setup.Map;
  var mapdiv = owl.Dom.Get($C.Element);

  // if map element is found
  if (mapdiv.length != 1) return;

  var scr = document.createElement('script');
  scr.src = 'https://maps.googleapis.com/maps/api/js?key=' + $C.API + '&callback=ph.mapStart';
  scr.async = 1;
  document.head.appendChild(scr);

};


// show map
ph.mapStart = function() {
  var $C = ph.Setup.Map;
  var mapdiv = owl.Dom.Get($C.Element)[0];

  owl.Css.ClassApply(mapdiv, $C.ActiveClass);

  // show map
  var mapControl = new google.maps.Map(mapdiv, {
    center: $C.center,
    zoom: $C.Zoom,
    mapTypeId: $C.Type
  });

  // show marker
  new google.maps.Marker({
    position: $C.center,
    map: mapControl
  });

};


// ---------------------------------------------
// Analytics tracking
var _gaq = _gaq || [];
ph.Analytics = function() {
  if (location.host.indexOf(".co") >= 0) {
    _gaq.push(["_setAccount", ph.Setup.Analytics]);
    _gaq.push(["_trackPageview"]);
    var ga = document.createElement("script");
    ga.type = "text/javascript";
    ga.async = true;
    ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
    var s = document.getElementsByTagName("head")[0];
    s.appendChild(ga);
  }
};
