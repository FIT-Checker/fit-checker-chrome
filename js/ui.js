var fitCheckerUi = {
	inner: {
		showMessage: function(message, className) {
			console.log(className + ': ' + message);
		}
	},
	showErrorMessage: function(message) {
		this.inner.showMessage(message, 'error');
	},
	showSuccessMessage: function(message) {
		this.inner.showMessage(message, 'success');
	},
	removeAllMessages: function() {
		console.log('Remove all messages');
	},
	addCourseToMenu: function(courseName) {
		var menu = $('.menu');
        var item = $(document.createElement('a'));
        item.attr('href', '#');
        item.attr('id', courseName);
        item.addClass('tab');
        item.html(courseName);
        menu.append(item);
	},
	showCourseDetails: function(courseName) {
		$('#' + courseName).addClass('active');
	},
	showMenu: function() {
		$('.menu').removeClass('invisible');
	},
	hideMenu: function() {
		console.log('Menu hidden.');
	},
	showLoader: function() {
		console.log('Loader shown.');
	},
	hideLoader: function() {
		console.log('Loader hidden.');
	},
	clearMenu: function() {
		var menu = $('.menu');
		menu.addClass('invisible');
		menu.html('');
	},
	getContentElement: function() {
		console.log('Content element returned.');
	},
	showUsername: function(username) {
		console.log('Username "' + username + '" shown.');
	},
	hideUsername: function() {
		console.log('Username hidden.');
	}
};
