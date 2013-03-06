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
		console.log('Course "' + courseName + '" added to menu.');
	},
	showCourseDetails: function(courseName) {
		console.log('Course "' + courseName + '" details shown.');
	},
	showMenu: function() {
		console.log('Menu shown.');
	},
	hideMenu: function() {
		console.log('Menu hidden.');
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
