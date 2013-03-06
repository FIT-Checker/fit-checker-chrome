var fitCheckerUi = {
	inner: {
		setEmpty: function(el) {
			$(el).html('');
		},
		show: function(el) {
			$(el).removeClass('invisible');
		},
		hide: function(el) {
			$(el).addClass('invisible');
		},
		showMessage: function(message, className) {
			var messageElement = $(document.createElement('li'));
			messageElement.addClass(className);
			messageElement.html(message);
			var messages = $('.messages');
			messages.append(messageElement);
			messages.show();
		},
		getMessagesElement: function() {
			return $('.messages');
		},
		getMenuElement: function() {
			return $('.menu');
		},
		getLoaderElement: function() {
			return $('.loader');
		},
		getUserInfoElement: function() {
			return $('.user-info');
		}
	},
	showErrorMessage: function(message) {
		this.inner.showMessage(message, 'error');
	},
	showSuccessMessage: function(message) {
		this.inner.showMessage(message, 'success');
	},
	removeAllMessages: function() {
		var messages = this.inner.getMessagesElement();
		messages.fadeOut();
		this.inner.setEmpty(messages);
	},
	addCourseToMenu: function(courseName) {
		var menu = this.inner.getMenuElement();
        var item = $(document.createElement('a'));
        item.attr('href', '#');
        item.attr('id', courseName);
        item.addClass('tab');
        item.html(courseName);
        menu.append(item);
	},
	showCourseDetails: function(courseName) {
		$('#' + courseName).addClass('active');
		// TODO - show tab content
	},
	showMenu: function() {
		this.inner.show(this.inner.getMenuElement());
	},
	hideMenu: function() {
		this.inner.hide(this.inner.getMenuElement());
	},
	clearMenu: function() {
		this.hideMenu();
		this.inner.setEmpty(this.inner.getMenuElement());
	},
	showLoader: function() {
		this.inner.show(this.inner.getLoaderElement());
	},
	hideLoader: function() {
		this.inner.hide(this.inner.getLoaderElement());
	},
	getContentElement: function() {
		return $('.content');
	},
	showUsername: function(username) {
		var userInfo = this.inner.getUserInfoElement();
		userInfo.html(username);
		this.inner.show(userInfo);
	},
	hideUsername: function() {
		this.inner.hide(this.inner.getUserInfoElement());
	},
	clearUsername: function() {
		this.hideUsername();
		this.inner.setEmpty(this.inner.getUserInfoElement());
	}
};
