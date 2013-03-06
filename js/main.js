var subjects = [];
var statuses = [];
var points = [];
var subjectContents = [];

var application = {
	inner: {
		// Browser class instance variable
		browser: null,
		username: ''
	},
	run: function() {
		this.inner.browser = browserChrome();
		this.loadSubjects();
	},
	loadSubjects: function() {
		fitChecker.getSubjectsFromEdux(this.showCoursesMenu, this.showErrorMessage);
	},
	showErrorMessage: function(message) {
		fitChecker.showMessage(message, 'error');
	},
	showCoursesMenu: function(courses) {
        application.clearMenu();
        var parent = application;
		$(courses).each(function (index, course) {
			parent.addCourseToMenu(course);
		});
        $('.menu').removeClass('invisible');
	},
    clearMenu: function() {
        var menu = $('.menu');
        menu.addClass('invisible');
        menu.html('');
    },
    addCourseToMenu: function(course) {
        var menu = $('.menu');
        var item = $(document.createElement('a'));
        item.attr('href', '#');
        item.attr('id', course);
        item.addClass('tab');
        item.html(course);
        menu.append(item);
    },
    activateTab: function(id) {
        $('#' + id).addClass('active');
    } 
};

// Fill prepared data into the extension DOM
function fillData(username, subjects, contents, statuses, points) {
    var i = 0;
    var htmlList = '';
    var statusClass = '';
    var pointsContent = null;

    htmlList = '<ul>';
    for (i = 0; i < subjects.length; i++) {
        if (statuses[i] == 'inclusion') {
            statusClass = ' orange';
        } else if(statuses[i] == 'succeed') {
            statusClass = ' green';
        } else if(statuses[i] == 'failed') {
            statusClass = ' red';
        } else {
            statusClass = '';
        }
        htmlList += '<li><a class="tab' + statusClass + '" href="#" id="' +
        subjects[i] + '">' + subjects[i] + '</a></li>';
        if (contents[i] === null) {
            contents[i] = 'Data nejsou k dispozici.';
        }
        pointsContent = '';
        if (points[i] !== null) {
            pointsContent = '<div class="points">' + points[i] + '</div>';
        }
        $("div#content").append('<div id="' + subjects[i] +
            '_content" class="subject">' + contents[i] + pointsContent +
                '<a class="edux-link" href="https://edux.fit.cvut.cz/courses/' +
                subjects[i] + '/classification/student/' + username +
                '/start">' + subjects[i] + ' na Eduxu</a>' +
            '</div>');
        $("div#" + subjects[i] + '_content').hide();
    }

    browser.getLinksAlive('edux-link');

    htmlList += '</ul>';
    $("div#menu").html(htmlList);
    $("div#menu").css("display", "block");

    $("a#" + subjects[0]).parent().addClass("current");
    $("div#" + subjects[0] + '_content').show();

    setStatus('Sta\u017Eeno', 'ok');

    $('#menu a.tab').live('click', function() {
        // Get the tab name
        var contentname = $(this).attr("id") + "_content";

        // hide all other tabs
        $("div#content div.subject").hide();
        $("div#menu ul li").removeClass("current");

        // show current tab
        $("div#" + contentname).show();
        $(this).parent().addClass("current");
    });
}

// Parsing logic for each subject
function parseSubjectData(responseText) {
	var status = null;
    sumOfPoints = null;

    subjectName = $("a.wikilink2", responseText).attr('href');
    subjectName = subjectName.replace(/\/courses\/([^\/]*)\/.*/, "$1");
    subjCont = $("div.overTable:eq(0)", responseText).html();

    if (subjCont !== null) {
        // Get rid of unneccessary content
        subjCont = subjCont.replace(/(.*)<thead>.*<\/thead>(.*)/, "$1$2");
        subjCont = subjCont.replace(/(.*)<tr><td>login<\/td>.*<\/tr>(.*)/, "$1$2");

        secondTable = $("div.overTable:eq(1)", responseText).html();
        if (secondTable !== null) {
            secondTable = secondTable.replace(/(.*)<thead>.*<\/thead>(.*)/, "$1$2");
            subjCont += '<h2><span>Shrnutí</span></h2>' + secondTable;
        }

        // Inclusion
        inclusionStrings = ['zápočet', 'zapocet', 'Zápočet', 'Zapocet',
            'klasifikovaný zápočet', 'Záp.', 'Zapocet2', 'nárok na zápočet'];
        inclusionValues= ['ANO', 'Ano', 'Z', '√'];
        for (i = 0; i < inclusionStrings.length; i++) {
            if (status == 'inclusion') {
                break;
            }

            el = $("td:contentIs('" + inclusionStrings[i] + "')", subjCont);
            next = el.next('td');

            for (ii = 0; ii < next.length; ii++) {
                if (next[ii].firstChild !== null) {
                    if ($.inArray(next[ii].firstChild.nodeValue, inclusionValues) != -1) {
                        status = 'inclusion';
                        break;
                    }
                }
            }
        }

        // Mark
        var markStrings = ['klasifikovaný zápočet', 'vysledek', 'Známka', 'Znamka' , 'zápočet', 'Zápočet', 'Klasifikace'];
        greenValues = ['A', 'B', 'C', 'D', 'E'];
        for (i = 0; i < markStrings.length; i++) {
            el = $("td:contentIs('" + markStrings[i] + "')", subjCont);
            if (el.length > 0) {
                mark = el.next('td');

                for (ii = 0; ii < mark.length; ii++) {
                    if (mark[ii].firstChild !== null) {
                        realMark = mark[ii].firstChild.nodeValue;
                        if ($.inArray(realMark, greenValues) != -1) {
                            status = 'succeed';
                            break;
                        } else if (realMark == 'F') {
                            status = 'failed';
                            break;
                        }
                    }
                }
            }
        }

        // Get sum of all points
        sumStrings = ['celkem', 'Celkem', 'suma', 'cvičení celkem', 'hodnoceni', 'Součet cvičení',
            'celkový počet', 'cviceni_celkem', 'cviceni_celkem:', 'Suma2',
            'Suma', 'Součet bodů'];
        for (i = 0; i < sumStrings.length; i++) {
            el = $("td:contentIs('" + sumStrings[i] + "')", subjCont);
            if (el.length > 0) {
                next = el.next('td');
                for (ii = 0; ii < next.length; ii++) {
                    if (next[ii].firstChild !== null) {
                        sumOfPoints = next[ii].firstChild.nodeValue;
                    }
                }
                break;
            }
        }
    }

    return {
        'subject': subjectName,
        'status': status,
        'points': sumOfPoints,
        'content': subjCont
    };
}

function downloadByLocalStorage(username, allSubjects, i) {
    xhrIn = new XMLHttpRequest();
    xhrIn.open("GET", "https://edux.fit.cvut.cz/courses/" +
        allSubjects[i] + "/_export/xhtml/" +
        "classification/student/" + username + "/start", true);
    xhrIn.onreadystatechange = function() {
        if (xhrIn.readyState == 4) {
            result = parseSubjectData(xhrIn.responseText);

            if (result !== null && $.inArray(result.subject, subjects) == -1) {
                subjects.push(result.subject);
                statuses.push(result.status);
                points.push(result.points);
                subjectContents.push(result.content);
            }

            percents = Math.floor((((i+1)/allSubjects.length)*100));
            setStatus('Stahuji data - ' + percents + '%', 'loading');
            i++;

            // Final phase
            if ((i) == allSubjects.length) {
                fillData(username, subjects, subjectContents, statuses, points);
                return null;
            }
            downloadByLocalStorage(username, allSubjects, i);
        }
    };
    xhrIn.send();

}

function downloadData(detect) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://edux.fit.cvut.cz/", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.responseText === '') {
                setStatus('Edux je nedostupn\u00FD' +
                    '(<a href="#" onClick="synchronizeData()">' +
                    'zkusit znova</a>)', 'error');
                return false;
            }

            if ($('input[value="Přihlásit se"]', xhr.responseText).length > 0) {
                setStatus('Nejste p\u0159ihl\u00E1\u0161en/a na <a href="' +
                    'https://edux.fit.cvut.cz/start?do=login" class="link">' +
                    'Eduxu</a>', 'error');
                browser.getLinksAlive();
                return false;
            }

            // Get logged user
            username = $("div.user", xhr.responseText).text()
                .replace(/.*\(([a-z0-9]*)\).*/, "$1");

            $("div#user").hide();
            $("div#user").text(username);
            $("div#user").fadeIn();

            setStatus('Stahuji data - 0%', 'loading');

            if (detect === false) {
                allSubjects = JSON.parse(localStorage.getItem('subjects'));
                downloadByLocalStorage(username, allSubjects, 0);
            } else {
                // Walk through ALL available subjects
                var i = 0;
                allSubjects = $("a[href^=/courses/]", xhr.responseText);
                allSubjects.each(function(index) {
                    var xhrIn = new XMLHttpRequest();

                    xhrIn.open("GET", "https://edux.fit.cvut.cz" +
                        $(this).attr('href') + "/_export/xhtml/" +
                        "classification/student/" + username + "/start", true);
                    xhrIn.onreadystatechange = function() {
                        if (xhrIn.readyState == 4) {
                            result = parseSubjectData(xhrIn.responseText);
                            if (result.content !== null &&
                                    $.inArray(result.subject, subjects) == -1) {
                                subjects.push(result.subject);
                                statuses.push(result.status);
                                points.push(result.points);
                                subjectContents.push(result.content);
                            }
                            i++;

                            percents = Math.floor(((i/allSubjects.length)*100));
                            setStatus('Stahuji data - ' + percents + '%', 'loading');

                            // Final phase
                            if (i == allSubjects.length) {
                                fillData(username, subjects, subjectContents,
                                    statuses, points);
                                localStorage.setItem('subjects',
                                    JSON.stringify(subjects));
                            }
                        }
                    };
                    xhrIn.send();
                });
            }
        }
    };
    xhr.send();
}

// Run application!
$(document).ready(function () {
	application.run();
});
