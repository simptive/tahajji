// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var changeFont = function(event) {
	let font = document.querySelector('input[name="fontSelect"]:checked').value;
	chrome.storage.sync.set({font: font});
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "urtextApply"});
  });
};

var changeFontSize = function(step){
  var value = parseInt(document.getElementById('fs-number').value.replace('%',''), 10);
  value = isNaN(value) ? 100 : value;
  value+=step;
  if(step > 0 && value > 150) value = 150;
  if(step < 0 && value < 50) value = 50;
  document.getElementById('fs-number').value = value+'%';

  chrome.storage.sync.set({scale: value});
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "urtextApply"});
  });
}

document.querySelectorAll('input[name="fontSelect"]').forEach(radio => {
	radio.addEventListener('change', changeFont);
});

document.getElementById('switchActive').addEventListener('change', function(event){
	document.getElementById('switchActiveLabel').textContent = event.target.checked ? 'Enabled' : 'Disabled'
	chrome.storage.sync.set({active: event.target.checked});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "urtextApply"});
  });
});

window.addEventListener('load', function(event){
	chrome.storage.sync.get(['active','font','scale'], function(data) {
		document.getElementById('switchActive').checked = data.active;
		document.getElementById('switchActiveLabel').textContent = data.active ? 'Enabled' : 'Disabled';
    document.getElementsByName('fontSelect').forEach(radio => {
      if(radio.value == data.font) radio.setAttribute('checked','');
    });
    document.getElementById('fs-number').value = data.scale+'%';
	});
});

document.getElementById('fs-increase').addEventListener('click', function(event){
  changeFontSize(5);
});

document.getElementById('fs-decrease').addEventListener('click', function(event){
  changeFontSize(-5);
});