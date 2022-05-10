(function() {
	if(window.hasRun) return true;
  window.hasRun = true;

	function isRTL(str){           
	  var urArray = ["ا", "ب", "ج", "د", "ن", "ی"]
	  var intersection = urArray.filter(value => str.split('').includes(value));
	  return intersection.length > 0;
	};

	function applyScaling(node,data){
		if(!data.fontScale) return;
		node.setAttribute('data-urtext-fontscale', data.fontScale);
		var xStyle = node.getAttribute('style') || '';
		node.setAttribute('style', xStyle.replace(/;urt;.+;urt;/, ''));

  	var xSize = parseFloat(window.getComputedStyle(node).fontSize);
  	var xHeight = parseFloat(window.getComputedStyle(node).lineHeight);

  	var nSize = Math.round(data.fontScale/100 * xSize);
  	var nHeight = Math.round(data.lineScale/100 * xHeight);
  	var urtStyle = ';urt;font-size:'+nSize+'px;line-height:'+nHeight+'px;urt;';
  	
  	xStyle = node.getAttribute('style');
  	node.setAttribute('style', xStyle+urtStyle);
	}

	function setStyle(node,data){
	  // setting text-align in nearest parent div if available because doesn't work often on other elements
	  var divParent = node.closest('div') == undefined ? node : node.closest('div');
	  divParent.classList.add("urtext-parent");
	  node.classList.add("urtext-self");
	  node.classList.add("urtext-font-"+data.font);
	  applyScaling(node,data);
	}

	function recursiveApply(node,data){
		if(node.nodeName == '#text' && isRTL(node.textContent)){
			setStyle(node.parentNode,data);
		}else if((node.nodeName == 'INPUT' || node.nodeName == 'TEXTAREA') && node.type !== 'hidden'){
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

	function switchScalingAll(node,data){
		node.querySelectorAll("[class*='urtext-font-']").forEach(element => {
	  	applyScaling(element, data);
		});
	}

	function sameFont(aNode,font){
		var same = false;
		aNode.classList.forEach(c => { if(c == 'urtext-font-'+font) same = true; });
		return same;
	}

	function sameScaling(aNode,data){
		let fontScale = parseInt(aNode.getAttribute('data-urtext-fontscale') || 0);
		let lineScale = parseInt(aNode.getAttribute('data-urtext-linescale') || 0);
		return fontScale === data.fontScale && lineScale === data.lineScale;
	}

	function fontApply(node,data){
		let exsNode = node.querySelector("[class*='urtext-font-']");
		// If an element found with style, check its font before switching, otherwise apply first time
		if(exsNode){			
			if(!sameFont(exsNode,data.font)) switchFontAll(node,data.font);
			if(!sameScaling(exsNode,data)) switchScalingAll(node,data);
		}else{ recursiveApply(node,data); }
	}

	function fontClear(node){
		// in case of input & textarea change to LTR or empty, we need parent of 'urtext-parent'
		if(node.childNodes.length == 0) node = node.closest('div') ? node.closest('div').parentNode : node.parentNode;
		node.querySelectorAll("[class*='urtext-']").forEach(node => {
	  	node.className.split(' ').forEach(c => { if(c.search("urtext-") > -1) node.classList.remove(c); });
	  	let xStyle = node.getAttribute('style') || '';
	  	node.setAttribute('style', xStyle.replace(/;urt;.+;urt;/, ''));
	  	node.removeAttribute('data-urtext-fontscale');
	  	node.removeAttribute('data-urtext-linescale');
		});
	}

	function actionApply(node){
		// 1. On re-installation, this script may get orphan and will throw error 
		// 		on storage request, checking runtime will save fatal error.
		// 2.	Check if node isn't an html element (e.g. ajax loaded text, SVG)
		if(chrome.runtime.id == undefined ||
			['IMG','IFRAME','SCRIPT','LINK'].indexOf(node.nodeName) > -1 ||
			typeof node.querySelector == 'undefined') return;
		if(node.nodeName == '#document') node = document.body;
		if(node.nodeName == 'BODY') console.log('Applying on Full body');
		chrome.storage.sync.get(['active','font','fontScale','lineScale'], function(data){
			data.active ? fontApply(node, data) : fontClear(node);
		});
	}

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.message == 'urtextApply'){
			actionApply(document);
			sendResponse({success: true});
		}
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
  actionApply(document.body);

})();