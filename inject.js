(function() {
	if(window.hasRun) return true;
  window.hasRun = true;

	function isRTL(str){           
	  var urArray = ["ا", "ب", "ج", "د", "ن", "ی"]
	  var intersection = urArray.filter(value => str.split('').includes(value));
	  return intersection.length > 0;
	};

	function setStyle(node,font){
	  // setting text-align in nearest parent div if available because doesn't work often on other elements
	  var divParent = node.closest('div') == undefined ? node : node.closest('div');
	  divParent.classList.add("urtext-parent");
	  node.classList.add("urtext-self");
	  node.classList.add("urtext-font-"+font);
	}

	function recursiveFix(node,font){
		if(node.nodeName == '#text' && isRTL(node.textContent))
	    setStyle(node.parentNode,font);
		else
			[].forEach.call(node.childNodes, function(n){ recursiveFix(n,font); });
	}

	function switchFont(node,font){
		node.querySelectorAll("[class*='urtext-font-']").forEach(element => {
	  	element.classList.forEach(c => {
	  		if(c.search("urtext-font") > -1){
	  			element.classList.remove(c);
	  			element.classList.add("urtext-font-"+font);
	  		}
	  	});
		});
	}

	function sameFont(aNode,font){
		var same = false;
		aNode.classList.forEach(c => { if(c == 'urtext-font-'+font) same = true; });
		return same;
	}

	function fontFix(node){
		// On re-installation, this script may get orphan and will throw error on storage request
		if(chrome.runtime.id == undefined) return;
		chrome.storage.sync.get('font', function(data){
			font = data.font;
			// node isn't an html element (e.g. ajax loaded text)
			if(typeof node.querySelector == 'undefined') return;
			let exsNode = node.querySelector("[class*='urtext-font-']");
			// If an element found with style, check its font before switching, otherwise apply first time
			if(exsNode){ 
				if(!sameFont(exsNode,font)) switchFont(node,font); 
			}else{ recursiveFix(node,font); }
		});
	}

	function fontClear(node){
		node.querySelectorAll("[class*='urtext-']").forEach(node => {
	  	node.className.split(' ').forEach(c => { if(c.search("urtext-") > -1) node.classList.remove(c); });
		});
	}

	chrome.runtime.onMessage.addListener(function(request, sender){
	  if(request.message == 'setFont')
	    fontFix(document);
	  else if(request.message == 'clearFont')
	  	fontClear(document);
	});

	// for ajax content
  document.addEventListener('DOMNodeInserted', function(event){
    fontFix(event.target);
  });

  // final call
  fontFix(document);

})();