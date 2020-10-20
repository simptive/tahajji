// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//if(!chrome.runtime.lastError && results && results.length && results[0] !== true){

function injectFiles(tabId){
   // script to be inserted at document-end, css at default
   // allFrames will handle iframe too
  chrome.tabs.executeScript(tabId, { file: 'inject.js', runAt: 'document_end', allFrames: true }, function(results){
    if(chrome.runtime.lastError || !results || !results.length) return;
    if(results[0] == true) // script is loaded already, just check & change font in case
      chrome.tabs.sendMessage(tabId, {message: "urtextApply"});
    else{
      chrome.tabs.insertCSS(tabId, { file: 'css/fonts.css', allFrames: true });
      chrome.tabs.insertCSS(tabId, { file: 'css/inject.css', allFrames: true });
    }
  });
}

chrome.runtime.onInstalled.addListener(function() {

  chrome.storage.sync.set({active: true, font: 'jameel-noori-nastaleeq'});

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: '.*' },
          })
        ], actions: [ new chrome.declarativeContent.ShowPageAction() ]}
    ]);
  });

});

chrome.tabs.onUpdated.addListener(function(tabId) {
  injectFiles(tabId);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  injectFiles(activeInfo.tabId);
});