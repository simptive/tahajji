// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var changeFont = function(event) {
	let font = document.querySelector('input[name="fontSelect"]:checked').value;
	chrome.storage.sync.set({font: font});
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "setFont"});
  });
};

document.querySelectorAll('input[name="fontSelect"]').forEach(radio => {
	radio.addEventListener('change', changeFont);
});

document.getElementById('clear').addEventListener('click', function(event){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "clearFont"});
  });
});

window.addEventListener('load', function(event){
  chrome.storage.sync.get('font', function(data) {
	  document.getElementsByName('fontSelect').forEach(radio => {
			if(radio.value == data.font) radio.setAttribute('checked','');
		});
	});
});