var browserChrome = {
	init: function() {
		chrome.browserAction.setBadgeBackgroundColor({
			'color': [0, 0, 0, 255]
		});
	},
	setBadge: function(value) {
		chrome.browserAction.setBadgeText({
			'text': value
		});
	},
	removeBadge: function() {
		this.setBadge('');
	},
	openUrl: function(url) {
		chrome.tabs.create({
			'url': url
		});
	},
	makeLinksClickable: function() {
		var parent = this;
		$("a.link").off('click').on('click', function() {
			var link = $(this);
			parent.openUrl(link.attr('href'));
		});
	}
};
