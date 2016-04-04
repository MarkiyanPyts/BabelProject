(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IssueTracker = function () {
    function IssueTracker() {
        _classCallCheck(this, IssueTracker);

        var ioPath = "https://" + window.location.hostname;
        this.socket = io(ioPath);
        this.initCache();
        this.setListeners();
    }

    _createClass(IssueTracker, [{
        key: "initCache",
        value: function initCache() {
            this.createProjectButton = $(".add-project").length ? $(".add-project") : false;
            this.createProjectModal = $("#addProjectModal").length ? $("#addProjectModal") : false;
            this.loginForm = $(".login-form").length ? $(".login-form") : false;
            this.loginErrorModal = $("#LoginErrorModal");
            this.registerForm = $(".register-form").length ? $(".register-form") : false;
            this.registerErrorModal = $("#RegistrationErrorModal");
            this.addNewProjectForm = $("#addNewProject").length ? $("#addNewProject") : false;
            this.projectsPage = $(".projects-page").length ? $(".projects-page") : false;
            this.projectsSection = $(".projects-section");
            this.projectEditSelector = ".project-edit";
            this.projectDeleteSelector = ".project-delete";
            this.deleteProjectFormSelector = "#deleteProject";
            this.updateProjectFormSelector = "#updateProject";
            this.projectPage = $(".project-page").length ? $(".project-page") : false;
            this.addIssue = $(".add-issue");
            this.addIssueForm = $("#addNewIssue").length ? $("#addNewIssue") : false;
            this.updateIssueForm = $("#updateIssue").length ? $("#updateIssue") : false;
            this.deleteIssueForm = $("#deleteIssue").length ? $("#deleteIssue") : false;
            this.issueEditSelector = ".issue-edit";
            this.issueDeleteSelector = ".issue-delete";
        }
    }, {
        key: "login",
        value: function login($target) {
            var _this = this;

            var data = $target.serialize();
            /*let name = data[0].value;
            let password = data[1].value;*/
            var loginPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/login",
                    method: "POST",
                    data: data
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            loginPromise.then(function (data) {
                window.location = data.redirectTo;
            }).catch(function (jqXHR, textStatus) {
                _this.loginErrorModal.modal();
            });
        }
    }, {
        key: "register",
        value: function register($target) {
            var _this2 = this;

            var data = $target.serialize();
            /*let name = data[0].value;
            let password = data[1].value;*/
            var registerPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/register",
                    method: "POST",
                    data: data
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            registerPromise.then(function (data) {
                console.log("success reg:", data);
                window.location = data.redirectTo;
            }).catch(function (jqXHR, textStatus) {
                console.log("login error", jqXHR, textStatus);
                _this2.registerErrorModal.modal();
            });
        }
    }, {
        key: "setListeners",
        value: function setListeners() {
            var _this3 = this;

            this.loginAndRegisterListeners();
            this.projectsListeners();

            $(window).load(function () {
                if (_this3.projectsPage) {
                    _this3.populateProjectsPage();
                }

                if (_this3.projectPage) {
                    _this3.populateProjectPage(window.resources.project);
                }
            });
        }
    }, {
        key: "projectsListeners",
        value: function projectsListeners() {
            var _this4 = this;

            if (this.createProjectButton) {
                this.createProjectButton.on("click", function (ev) {
                    ev.preventDefault();
                    _this4.createProjectModal.modal();
                });
            }

            if (this.addNewProjectForm) {
                this.addNewProjectForm.on('submit', function (ev) {
                    ev.preventDefault();
                    _this4.createProject($(ev.target));
                });
            }

            $("body").on("click", this.projectEditSelector, function (ev) {
                ev.stopPropagation();
                var $parent = $(ev.target).closest("tr");
                var projectId = $parent.attr("data-project-id");
                var projectName = $parent.find(".pr-name").html();
                var projectDescription = $parent.find(".pr-description").html();

                $("#editProjectModal").modal();
                $("#updatee-project-id").val(projectId);
                $("#new-project-name").val(projectName);
                $("#new-description").val(projectDescription);
            });

            $("body").on("click", this.projectDeleteSelector, function (ev) {
                ev.stopPropagation();
                var projectId = $(ev.target).closest("tr").attr("data-project-id");
                $("#deleteProjectModal").modal();
                $("#delete-project-id").val(projectId);
            });

            $("body").on("submit", this.deleteProjectFormSelector, function (ev) {
                ev.preventDefault();
                _this4.removeProject($(ev.target).serialize());
            });

            $("body").on("submit", this.updateProjectFormSelector, function (ev) {
                ev.preventDefault();
                _this4.updateProject($(ev.target).serialize());
            });

            $("body").on("click", this.issueEditSelector, function (ev) {
                ev.stopPropagation();
                var $parent = $(ev.target).closest("tr");
                var issueId = $parent.attr("data-issue-id");
                var issueName = $parent.find(".issue-name").html();
                var issueDescription = $parent.find(".issue-description").html();

                $("#editIssueModal").modal();
                $("#updatee-issue-id").val(issueId);
                $("#new-issue-name").val(issueName);
                $("#new-description").val(issueDescription);
            });

            $("body").on("click", this.issueDeleteSelector, function (ev) {
                ev.stopPropagation();
                console.log("here");
                var issueId = $(ev.target).closest("tr").attr("data-issue-id");
                $("#deleteIssueModal").modal();
                $("#delete-issue-id").val(issueId);
            });

            if (this.deleteIssueForm) {
                this.deleteIssueForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this4.deleteIssue($(ev.target).serialize());
                });
            }

            if (this.updateIssueForm) {
                this.updateIssueForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this4.updateIssue($(ev.target).serialize());
                });
            }

            $("body").on("click", ".project-item", function (ev) {
                var $target = $(ev.target).closest(".project-item");
                window.location.href = "/project/" + $target.attr("data-project-id");
            });

            $("body").on("click", ".issue-item", function (ev) {
                var $target = $(ev.target).closest(".issue-item");
                window.location.href = "/issue/" + $target.attr("data-issue-id");
            });

            this.socket.on("updateProjects", function () {
                _this4.populateProjectsPage();
            });

            this.addIssue.on("click", function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                console.log($("#addIssueModal"));
                $("#addIssueModal").modal();
            });

            if (this.addIssueForm) {
                this.addIssueForm.on("submit", function (ev) {
                    ev.preventDefault();
                    var serialized = $(ev.target).serialize();
                    var deserializedData = _this4.deserializeForm(serialized);
                    var estimatedMinutes = _this4.convertEstimate(deserializedData.originalEstimate);

                    if (!estimatedMinutes) {
                        $(".original-estimate-group").addClass("has-error");
                        return;
                    }

                    deserializedData.originalEstimate = estimatedMinutes;
                    _this4.createIssue(deserializedData);
                    console.log(deserializedData);
                });
            }

            this.socket.on("updateIssues", function (data) {
                console.log(data);
                if (data.project == resources.project) {
                    _this4.populateProjectPage(resources.project);
                }
            });
        }
    }, {
        key: "deserializeForm",
        value: function deserializeForm(serializedFormData) {
            var serializedDataArray = serializedFormData.split("&");
            var deserializeddData = new Object();
            var itemSplit = void 0;

            for (var length = serializedDataArray.length, i = 0; i < length; i++) {
                serializedDataArray[i] = serializedDataArray[i].replace(/\+/g, " ");

                itemSplit = serializedDataArray[i].split("=");
                deserializeddData[itemSplit[0]] = itemSplit[1];
            }
            return deserializeddData;
        }
    }, {
        key: "convertEstimate",
        value: function convertEstimate(estimateString) {
            var regexp = /(^\d*h \d*m$)|(^\d*(\.\d+)?h$)|(^\d*m$)/; /*e.g 1h 30m or 30m or 1.5h*/
            var match = estimateString.match(regexp);
            var matchSplit = void 0;
            var splitLength = void 0;
            var hours = void 0;
            var minutes = 0;
            var additionalMinutes = 0;

            if (!match) {
                return false;
            }

            match = match[0];
            matchSplit = match.split(" ");
            splitLength = matchSplit.length;

            if (splitLength == 1) {
                var indexOfM = matchSplit[0].indexOf("m");
                var indexOfH = matchSplit[0].indexOf("h");

                if (indexOfM != -1) {
                    minutes = matchSplit[0].slice(0, indexOfM);
                }

                if (indexOfH != -1) {
                    hours = matchSplit[0].slice(0, indexOfH);
                }
            } else {
                var _indexOfH = matchSplit[0].indexOf("h");
                var _indexOfM = matchSplit[1].indexOf("m");

                if (_indexOfH != -1) {
                    hours = matchSplit[0].slice(0, _indexOfH);
                }

                if (_indexOfM != -1) {
                    minutes = matchSplit[1].slice(0, _indexOfM);
                }
            }

            if (hours) {
                additionalMinutes = parseInt(60 * hours);
            }

            minutes = parseInt(minutes);
            minutes += additionalMinutes;

            return minutes;
        }
    }, {
        key: "createIssue",
        value: function createIssue(data) {
            var createIssuePromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issue",
                    method: "POST",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            createIssuePromise.then(function (data) {
                console.log("success reg:", data);
                $("#addIssueModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error during project creation", jqXHR, textStatus);
                alert("Error during issue creation");
            });
        }
    }, {
        key: "removeProject",
        value: function removeProject(data) {
            var deleteProjectPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/project",
                    method: "DELETE",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            deleteProjectPromise.then(function (data) {
                $("#deleteProjectModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing project", jqXHR, textStatus);
                alert("Error while removing project");
            });
        }
    }, {
        key: "updateProject",
        value: function updateProject(data) {
            var updateProjectPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/project",
                    method: "PUT",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    $("#editProjectModal").modal("hide");
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            updateProjectPromise.then(function (data) {
                $("#deleteProjectModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing project", jqXHR, textStatus);
                alert("Error updating projects");
            });
        }
    }, {
        key: "deleteIssue",
        value: function deleteIssue(data) {
            var deleteIssuePromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issue",
                    method: "DELETE",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            deleteIssuePromise.then(function (data) {
                $("#deleteIssueModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing issue", jqXHR, textStatus);
                alert("Error removing issue");
            });
        }
    }, {
        key: "updateIssue",
        value: function updateIssue(data) {
            var updateIssuePromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issue",
                    method: "PUT",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    $("#editProjectModal").modal("hide");
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            updateIssuePromise.then(function (data) {
                $("#deleteProjectModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error updating issue", jqXHR, textStatus);
                alert("Error while updating issue");
            });
        }
    }, {
        key: "populateProjectPage",
        value: function populateProjectPage(projectId) {
            var issuesPromise = this.getIssues(projectId, populateIssuesTemplate);
            var $issuesSection = $(".project-page .issues-section");

            issuesPromise.then(function (data) {
                console.log("issues collection is::", data);
                populateIssuesTemplate(data);
            });

            function populateIssuesTemplate(issuesList) {
                var getProjectsPromise = new Promise(function (resolve, reject) {
                    var request = $.ajax({
                        url: "/templates/templates.html",
                        method: "GET",
                        dataType: 'html'
                    });

                    request.done(function (data) {
                        resolve(data);
                    });

                    request.fail(function (jqXHR, textStatus) {
                        reject(jqXHR, textStatus);
                    });
                });

                getProjectsPromise.then(function (data) {
                    var source = $(data).find("#project-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        issuesList: issuesList
                    };
                    var html = template(context);
                    $issuesSection.html(html);
                    $("#editIssueModal").modal("hide");
                }).catch(function (jqXHR, textStatus) {
                    console.log("error during issues template fetch", jqXHR, textStatus);
                    alert("Error during project creation");
                });
            }
        }
    }, {
        key: "populateProjectsPage",
        value: function populateProjectsPage() {
            var projectsPromise = this.getProjects();
            var projects = void 0;
            var that = this;

            projectsPromise.then(function (data) {
                console.log("success:", data);
                populateProjectsTemplate(data);
            }).catch(function (jqXHR, textStatus) {
                console.log("error fetching projects", jqXHR, textStatus);
                alert("Error fetching projects");
            });

            function populateProjectsTemplate(projectsList) {
                console.log(projectsList);
                var getProjectsPromise = new Promise(function (resolve, reject) {
                    var request = $.ajax({
                        url: "/templates/templates.html",
                        method: "GET",
                        dataType: 'html'
                    });

                    request.done(function (data) {
                        resolve(data);
                    });

                    request.fail(function (jqXHR, textStatus) {
                        reject(jqXHR, textStatus);
                    });
                });

                getProjectsPromise.then(function (data) {
                    var source = $(data).find("#projects-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        projectsList: projectsList
                    };
                    var html = template(context);
                    that.projectsSection.html(html);
                }).catch(function (jqXHR, textStatus) {
                    console.log("error during projects template fetch", jqXHR, textStatus);
                    alert("Error during project creation");
                });
            }
        }
    }, {
        key: "createProject",
        value: function createProject($target) {
            var data = $target.serialize();

            var createProjectPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/project",
                    method: "POST",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    $("#addProjectModal").modal("hide");
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            createProjectPromise.then(function (data) {
                console.log("success reg:", data);
            }).catch(function (jqXHR, textStatus) {
                console.log("error during project creation", jqXHR, textStatus);
                alert("Error during project creation");
            });
        }
    }, {
        key: "getProjects",
        value: function getProjects(callback) {
            var getProjectsPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/projectsItems",
                    method: "GET"
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });
            return getProjectsPromise;
        }
    }, {
        key: "getIssues",
        value: function getIssues(projectId, callback) {
            console.log("pri:", projectId);
            var getProjectsPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issues",
                    method: "GET",
                    data: {
                        projectId: projectId
                    }
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });
            return getProjectsPromise;
        }
    }, {
        key: "loginAndRegisterListeners",
        value: function loginAndRegisterListeners() {
            var _this5 = this;

            if (this.loginForm) {
                this.loginForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this5.login($(ev.target));
                });
            }

            if (this.registerForm) {
                this.registerForm.on("submit", function (ev) {
                    ev.preventDefault();

                    if ($("#password1").val() != $("#password2").val()) {
                        $(".form-group").addClass("has-error");
                        alert("passwords you entered are not identical");
                        return false;
                    }
                    _this5.register($(ev.target));
                });
            }
        }
    }]);

    return IssueTracker;
}();

exports.default = IssueTracker;

},{}],2:[function(require,module,exports){
'use strict';

var _IssueTracker = require('./IssueTracker');

var _IssueTracker2 = _interopRequireDefault(_IssueTracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var issueTracker = new _IssueTracker2.default();
//console.log(IssueTracker);
//var [a, b, c] = [1 , 2, 3];

},{"./IssueTracker":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLENBRGhCO0FBRVYsYUFBSyxNQUFMLEdBQWMsR0FBRyxNQUFILENBQWQsQ0FGVTtBQUdWLGFBQUssU0FBTCxHQUhVO0FBSVYsYUFBSyxZQUFMLEdBSlU7S0FBZDs7aUJBRGlCOztvQ0FRTDtBQUNSLGlCQUFLLG1CQUFMLEdBQTJCLEVBQUUsY0FBRixFQUFrQixNQUFsQixHQUEyQixFQUFFLGNBQUYsQ0FBM0IsR0FBK0MsS0FBL0MsQ0FEbkI7QUFFUixpQkFBSyxrQkFBTCxHQUEwQixFQUFFLGtCQUFGLEVBQXNCLE1BQXRCLEdBQStCLEVBQUUsa0JBQUYsQ0FBL0IsR0FBdUQsS0FBdkQsQ0FGbEI7QUFHUixpQkFBSyxTQUFMLEdBQWlCLEVBQUUsYUFBRixFQUFpQixNQUFqQixHQUEwQixFQUFFLGFBQUYsQ0FBMUIsR0FBNkMsS0FBN0MsQ0FIVDtBQUlSLGlCQUFLLGVBQUwsR0FBdUIsRUFBRSxrQkFBRixDQUF2QixDQUpRO0FBS1IsaUJBQUssWUFBTCxHQUFvQixFQUFFLGdCQUFGLEVBQW9CLE1BQXBCLEdBQTZCLEVBQUUsZ0JBQUYsQ0FBN0IsR0FBbUQsS0FBbkQsQ0FMWjtBQU1SLGlCQUFLLGtCQUFMLEdBQTBCLEVBQUUseUJBQUYsQ0FBMUIsQ0FOUTtBQU9SLGlCQUFLLGlCQUFMLEdBQXlCLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQVBqQjtBQVFSLGlCQUFLLFlBQUwsR0FBb0IsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2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c291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVUcmFja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGxldCBpb1BhdGggPSBcImh0dHBzOi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBpbyhpb1BhdGgpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhY2hlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0Q2FjaGUoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uID0gJChcIi5hZGQtcHJvamVjdFwiKS5sZW5ndGggPyAkKFwiLmFkZC1wcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwgPSAkKFwiI2FkZFByb2plY3RNb2RhbFwiKS5sZW5ndGggPyAkKFwiI2FkZFByb2plY3RNb2RhbFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5Gb3JtID0gJChcIi5sb2dpbi1mb3JtXCIpLmxlbmd0aCA/ICQoXCIubG9naW4tZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsID0gJChcIiNMb2dpbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckZvcm0gPSAkKFwiLnJlZ2lzdGVyLWZvcm1cIikubGVuZ3RoID8gJChcIi5yZWdpc3Rlci1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwgPSAkKFwiI1JlZ2lzdHJhdGlvbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybSA9ICQoXCIjYWRkTmV3UHJvamVjdFwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld1Byb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzUGFnZSA9ICQoXCIucHJvamVjdHMtcGFnZVwiKS5sZW5ndGggPyAkKFwiLnByb2plY3RzLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzU2VjdGlvbiA9ICQoXCIucHJvamVjdHMtc2VjdGlvblwiKTtcclxuICAgICAgICB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IgPSBcIi5wcm9qZWN0LWVkaXRcIjtcclxuICAgICAgICB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciA9IFwiLnByb2plY3QtZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjZGVsZXRlUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI3VwZGF0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnByb2plY3RQYWdlID0gJChcIi5wcm9qZWN0LXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0LXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZElzc3VlID0gJChcIi5hZGQtaXNzdWVcIik7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0gPSAkKFwiI2FkZE5ld0lzc3VlXCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3SXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybSA9ICQoXCIjdXBkYXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiN1cGRhdGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtID0gJChcIiNkZWxldGVJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2RlbGV0ZUlzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciA9IFwiLmlzc3VlLWVkaXRcIjtcclxuICAgICAgICB0aGlzLmlzc3VlRGVsZXRlU2VsZWN0b3IgPSBcIi5pc3N1ZS1kZWxldGVcIjtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgbG9naW5Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbG9naW5Qcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5yZWRpcmVjdFRvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRXJyb3JNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyKCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgLypsZXQgbmFtZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZGF0YVsxXS52YWx1ZTsqL1xyXG4gICAgICAgIGxldCByZWdpc3RlclByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9yZWdpc3RlclwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZWdpc3RlclByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5yZWRpcmVjdFRvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGVycm9yXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c0xpc3RlbmVycygpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdHNQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZSh3aW5kb3cucmVzb3VyY2VzLnByb2plY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdHNMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbi5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGROZXdQcm9qZWN0Rm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtLm9uKCdzdWJtaXQnLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3QoJChldi50YXJnZXQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkcGFyZW50LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0TmFtZSA9ICRwYXJlbnQuZmluZChcIi5wci1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3REZXNjcmlwdGlvbiA9ICRwYXJlbnQuZmluZChcIi5wci1kZXNjcmlwdGlvblwiKS5odG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LXByb2plY3QtbmFtZVwiKS52YWwocHJvamVjdE5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwocHJvamVjdERlc2NyaXB0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKS5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZUlkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlTmFtZSA9ICRwYXJlbnQuZmluZChcIi5pc3N1ZS1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlRGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0SXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1pc3N1ZS1uYW1lXCIpLnZhbChpc3N1ZU5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwoaXNzdWVEZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKVxyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1pc3N1ZS1pZFwiKS52YWwoaXNzdWVJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWUoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5wcm9qZWN0LWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIucHJvamVjdC1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3Byb2plY3QvXCIgKyAkdGFyZ2V0LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuaXNzdWUtaXRlbVwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5pc3N1ZS1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2lzc3VlL1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVQcm9qZWN0c1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZS5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJChcIiNhZGRJc3N1ZU1vZGFsXCIpKVxyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVzdGltYXRlZE1pbnV0ZXMgPSB0aGlzLmNvbnZlcnRFc3RpbWF0ZShkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFlc3RpbWF0ZWRNaW51dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5vcmlnaW5hbC1lc3RpbWF0ZS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5vcmlnaW5hbEVzdGltYXRlID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlSXNzdWUoZGVzZXJpYWxpemVkRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZXNlcmlhbGl6ZWREYXRhKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlSXNzdWVzXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBpZihkYXRhLnByb2plY3QgPT0gcmVzb3VyY2VzLnByb2plY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZShyZXNvdXJjZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZEZvcm1EYXRhKSB7XHJcbiAgICAgICAgbGV0IHNlcmlhbGl6ZWREYXRhQXJyYXkgPSBzZXJpYWxpemVkRm9ybURhdGEuc3BsaXQoXCImXCIpO1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWRkRGF0YSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICBsZXQgaXRlbVNwbGl0O1xyXG5cclxuICAgICAgICBmb3IobGV0IGxlbmd0aCA9IHNlcmlhbGl6ZWREYXRhQXJyYXkubGVuZ3RoLCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZWREYXRhQXJyYXlbaV0gPSBzZXJpYWxpemVkRGF0YUFycmF5W2ldLnJlcGxhY2UoL1xcKy9nLCBcIiBcIik7XHJcblxyXG4gICAgICAgICAgICBpdGVtU3BsaXQgPSBzZXJpYWxpemVkRGF0YUFycmF5W2ldLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgZGVzZXJpYWxpemVkZERhdGFbaXRlbVNwbGl0WzBdXSA9IGl0ZW1TcGxpdFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplZGREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRFc3RpbWF0ZShlc3RpbWF0ZVN0cmluZykge1xyXG4gICAgICAgIGxldCByZWdleHAgPSAvKF5cXGQqaCBcXGQqbSQpfCheXFxkKihcXC5cXGQrKT9oJCl8KF5cXGQqbSQpLzsgLyplLmcgMWggMzBtIG9yIDMwbSBvciAxLjVoKi9cclxuICAgICAgICBsZXQgbWF0Y2ggPSBlc3RpbWF0ZVN0cmluZy5tYXRjaChyZWdleHApO1xyXG4gICAgICAgIGxldCBtYXRjaFNwbGl0O1xyXG4gICAgICAgIGxldCBzcGxpdExlbmd0aDtcclxuICAgICAgICBsZXQgaG91cnM7XHJcbiAgICAgICAgbGV0IG1pbnV0ZXMgPSAwO1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsTWludXRlcyA9IDA7XHJcblxyXG4gICAgICAgIGlmKCFtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXRjaCA9IG1hdGNoWzBdO1xyXG4gICAgICAgIG1hdGNoU3BsaXQgPSBtYXRjaC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgc3BsaXRMZW5ndGggPSBtYXRjaFNwbGl0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYoc3BsaXRMZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZk0gPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJtXCIpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZkggPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJoXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZkggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMV0uaW5kZXhPZihcIm1cIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzFdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaG91cnMpIHtcclxuICAgICAgICAgICAgYWRkaXRpb25hbE1pbnV0ZXMgPSBwYXJzZUludCg2MCAqIGhvdXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1pbnV0ZXMgPSBwYXJzZUludChtaW51dGVzKTtcclxuICAgICAgICBtaW51dGVzICs9IGFkZGl0aW9uYWxNaW51dGVzO1xyXG5cclxuICAgICAgICByZXR1cm4gbWludXRlcztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBpc3N1ZSBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgZGVsZXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSByZW1vdmluZyBwcm9qZWN0XCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb2plY3QoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB1cGRhdGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVJc3N1ZVByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUlzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciByZW1vdmluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVByb2plY3RQYWdlKHByb2plY3RJZCkge1xyXG4gICAgICAgIGxldCBpc3N1ZXNQcm9taXNlID0gdGhpcy5nZXRJc3N1ZXMocHJvamVjdElkLCBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKTtcclxuICAgICAgICBsZXQgJGlzc3Vlc1NlY3Rpb24gPSAkKFwiLnByb2plY3QtcGFnZSAuaXNzdWVzLXNlY3Rpb25cIik7XHJcblxyXG4gICAgICAgIGlzc3Vlc1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlcyBjb2xsZWN0aW9uIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZShpc3N1ZXNMaXN0KSB7XHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdC10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzc3Vlc0xpc3Q6IGlzc3Vlc0xpc3RcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJGlzc3Vlc1NlY3Rpb24uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBpc3N1ZXMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlUHJvamVjdHNQYWdlKCkge1xyXG4gICAgICAgIGxldCBwcm9qZWN0c1Byb21pc2UgPSB0aGlzLmdldFByb2plY3RzKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3RzO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGZldGNoaW5nIHByb2plY3RzXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKHByb2plY3RzTGlzdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c0xpc3QpXHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0c0xpc3Q6IHByb2plY3RzTGlzdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByb2plY3RzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2plY3QoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNyZWF0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZVByb2plY3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9qZWN0cyhjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0c0l0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvamVjdHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzc3Vlcyhwcm9qZWN0SWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmk6XCIsIHByb2plY3RJZCk7XHJcbiAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3Vlc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFByb2plY3RzUHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubG9naW5Gb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW5Gb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naW4oJCggZXYudGFyZ2V0ICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMucmVnaXN0ZXJGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkKFwiI3Bhc3N3b3JkMVwiKS52YWwoKSAhPSAkKFwiI3Bhc3N3b3JkMlwiKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIuZm9ybS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcInBhc3N3b3JkcyB5b3UgZW50ZXJlZCBhcmUgbm90IGlkZW50aWNhbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBJc3N1ZVRyYWNrZXIgZnJvbSAnLi9Jc3N1ZVRyYWNrZXInO1xyXG5cclxubGV0IGlzc3VlVHJhY2tlciA9IG5ldyBJc3N1ZVRyYWNrZXIoKTtcclxuLy9jb25zb2xlLmxvZyhJc3N1ZVRyYWNrZXIpO1xyXG4vL3ZhciBbYSwgYiwgY10gPSBbMSAsIDIsIDNdO1xyXG4iXX0=
