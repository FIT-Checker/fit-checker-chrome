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
		},
		getContentElement: function() {
			return $('.content');
		},
		activateCourse: function(id) {
			this.deactivateAllCourses();
			$('#' + id).addClass('active');
		},
		deactivateAllCourses: function() {
			this.getMenuElement().find('a.tab').each(function(index, el) {
				$(el).removeClass('active');
			});
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
	addCourseToMenu: function(courseName, loaderCallback) {
		var menu = this.inner.getMenuElement();
        var item = $(document.createElement('a'));
        item.attr('href', '#');
        item.attr('id', courseName);
        item.addClass('tab');
        item.html(courseName);
        item.click(function (e) {
			loaderCallback($(this).attr('id'));
        });
        menu.append(item);
	},
	showCourseDetails: function(courseName, courseContent) {
		var content = this.inner.getContentElement();
		this.inner.hide(content);
		content.html(courseContent);
		this.inner.activateCourse(courseName);
		this.inner.show(content);
		this.hideLoader();
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
