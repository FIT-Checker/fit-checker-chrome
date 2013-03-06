var browserChrome = function() {
	chrome.browserAction.setBadgeBackgroundColor({
		'color': [0, 0, 0, 255]
	});

	this.setBadge = function(value) {
		chrome.browserAction.setBadgeText({
			'text': value
		});
	};

	this.removeBadge = function() {
		this.setBadge('');
	};

	this.openUrl = function(url) {
		chrome.tabs.create({
			'url': url
		});
	};

	this.makeLinksClickable = function() {
		var parent = this;
		$("a").off('click').on('click', function() {
			var link = $(this);
			parent.openUrl(link.attr('href'));
		});
	};
};
