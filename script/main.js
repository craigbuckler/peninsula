/*
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
