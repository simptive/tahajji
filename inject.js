(function() {
	if(window.hasRun) return true;
  window.hasRun = true;

	function isRTL(str){           
	  var urArray = ["ا", "ب", "ج", "د", "ن", "ی"]
	  var intersection = urArray.filter(value => str.split('').includes(value));
	  return intersection.length > 0;
	};

	function setSize(node,scale){
		node.setAttribute('data-urtex-size', scale);

		var xStyle = node.getAttribute('style');
  	var xSize = parseFloat(window.getComputedStyle(node).fontSize);
  	//var xSize = parseFloat(window.getComputedStyle(node, null).getPropertyValue('font-size'));
  	//console.log(scale);

  	var nSize = Math.ceil(scale/100 * xSize);
  	var urtStyle = ';urt;font-size:'+nSize+'px;urt;';
  	console.log(nSize);
  	
  	if(xStyle && xStyle.match(/;urt;.+;urt;/))
  		node.setAttribute('style', xStyle.replace(/;urt;.+;urt;/, urtStyle));
  	else
  		node.setAttribute('style', xStyle+urtStyle);
	}

	function setStyle(node,data){
	  // setting text-align in nearest parent div if available because doesn't work often on other elements
	  var divParent = node.closest('div') == undefined ? node : node.closest('div');
	  divParent.classList.add("urtext-parent");
	  node.classList.add("urtext-self");
	  node.classList.add("urtext-font-"+data.font);
	  setSize(node,data.scale);
	}

	function recursiveApply(node,data){
		if(node.nodeName == '#text' && isRTL(node.textContent)){
			setStyle(node.parentNode,data);
		}else if(node.nodeName == 'INPUT' || node.nodeName == 'TEXTAREA'){
			isRTL(node.value) ? setStyle(node,data) : fontClear(node);
		}else if(node == document || (typeof node.className == 'string' && node.className.search('urtext-self') == -1)){
			// some nodes like svg have object className instead of string
			// preventing to run on newly created span
			[].forEach.call(node.childNodes, function(n){ recursiveApply(n,data); });
		}
	}

	function switchFontAll(node,font){
		node.querySelectorAll("[class*='urtext-font-']").forEach(element => {
	  	element.classList.forEach(c => {
	  		if(c.search("urtext-font") > -1){
	  			element.classList.remove(c);
	  			element.classList.add("urtext-font-"+font);
	  		}
	  	});
		});
	}

	function switchSizeAll(node,scale){
		node.querySelectorAll("[class*='urtext-font-']").forEach(element => {
	  	setSize(element);
		});
	}

	function sameFont(aNode,font){
		var same = false;
		aNode.classList.forEach(c => { if(c == 'urtext-font-'+font) same = true; });
		return same;
	}

	function sameSize(aNode,scale){
		let xScale = aNode.getAttribute('data-urtext-size');
		return xScale ? parseInt(xScale) === scale : scale === 100;
	}

	function fontApply(node,data){
		// node isn't an html element (e.g. ajax loaded text)
		if(typeof node.querySelector == 'undefined') return;
		let exsNode = node.querySelector("[class*='urtext-font-']");
		// If an element found with style, check its font before switching, otherwise apply first time
		if(exsNode){ 
			if(!sameFont(exsNode,data.font)) switchFontAll(node,data.font);
			if(!sameSize(exsNode,data.scale)) switchSizeAll(node,data.scale);
		}else{ recursiveApply(node,data); }
	}

	function fontClear(node){
	  // in case of input & textarea change to LTR or empty, we need parent of 'urtext-parent'
		if(node.childNodes.length == 0) node = node.closest('div') ? node.closest('div').parentNode : node.parentNode;
		node.querySelectorAll("[class*='urtext-']").forEach(node => {
	  	node.className.split(' ').forEach(c => { if(c.search("urtext-") > -1) node.classList.remove(c); });
		});
	}

	function actionApply(node){
		// On re-installation, this script may get orphan and will throw error on storage request
		if(chrome.runtime.id == undefined) return;
		chrome.storage.sync.get(['active','font','scale'], function(data){
			data.active ? fontApply(node, data) : fontClear(node);
		});
	}

	chrome.runtime.onMessage.addListener(function(request, sender){
	  if(request.message == 'urtextApply') actionApply(document);
	});

	// for ajax content
  document.addEventListener('DOMNodeInserted', function(event){
    actionApply(event.target);
  });

  document.querySelectorAll("input,textarea").forEach(input => {
		input.addEventListener('input', function(event){
	    actionApply(event.target);
	  });
	});

  // final call
  actionApply(document);

})();