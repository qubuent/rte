(function(root, factory) {
if (typeof exports === "object") {
module.exports = factory(require('angular'));
} else if (typeof define === "function" && define.amd) {
define(['angular'], factory);
} else{
factory(root.angular);
}
}(this, function(angular) {
var editorTemplate = '<div id="editor"><div ng-repeat="page in pages"><div id ="page" contenteditable="true" ng-bind-html="page" style="border:1px solid black;"></div><div></div></div></div>';

angular.module('richTextEditorModule', ['ngSanitize'])
.config(['$provide',
	function($provide) {
		$provide.decorator("$sanitize",['$delegate', '$log', function($delegate, $log) {
			return function(text, target) {
				var result = $delegate(text, target);
				//$log.info("$sanitize input: " + text);
				//$log.info("$sanitize output: " + result);
				return result;
			};
		}]);
	}
])
.directive('richTextEditor', ['$rootScope', '$compile', '$timeout', '$q',
	function($rootScope, $compile, $timeout, $q) {
	let pageMaxHeight = 50;
	
	let	paginate = (pageElements, scope) => {
		let html =  '';
		let pageHeight = 0;
		let pageNumber = 0;
		scope.pages = [];
		_.each(pageElements, (pageElement) => {
			let selectionStart = pageElement.selectionStart;
			_.each(pageElement.childNodes, (node) => {
				pageHeight += node.clientHeight;
				if( pageHeight < pageMaxHeight) {
					html +=  node.outerHTML;
				} else {
					scope.pages[pageNumber] = html + node.outerHTML;
					pageHeight = 0;
					html = '';
					pageNumber++;
				}
			});
		});
		if (!scope.pages[pageNumber]){
			scope.pages[pageNumber] = html;
		}
	};
	
	let richTextEditorController = ($scope, $compile ) => {
/*		$scope.$watchCollection('pages', (newPage, oldPage) => {
			_.each(newPage, (page) => {
				let element = $compile(page);
			});
		});*/
	};
	
	let linker = ( scope, $element, attrs, ctrl ) => {
		
		scope.pages = [ scope.template ];
		
		let editor = document.getElementById('editor');
		
		editor.addEventListener('input', function(){
			let pageElements = document.querySelectorAll('div[contenteditable]');
			
			var range = document.createRange();
			var sel = window.getSelection();
/*			range.setStart(el.childNodes[2], 5);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);*/
			
			
			paginate(pageElements, scope);
			scope.$apply();
			//localStorage.setItem('editor', editor.innerHTML);
		});
		
/*			let editor = document.querySelector('#editor');
		
		let pageElements = document.querySelectorAll('div[contenteditable]');

		_.each(pageElements, (page) => {
			page.addEventListener('keyup', () => {
				let modifiedPageElements = document.querySelectorAll('div[contenteditable]');
			});
		});
*/

		
/*			let edit=document.getElementById('page');
		
		edit.innerHTML=localStorage.getItem('page');
		
		edit.addEventListener('blur',function(){
			localStorage.setItem('page',edit.innerHTML);
		});*/
	};
	
	return {
		controller: richTextEditorController,
	    controllerAs: 'rtec',
		link: linker,
		scope: {
			template: '=', //this is our content which we want to edit
		},
		template: editorTemplate,
		restrict: 'AE',
		replace: true
	}
}
]);
return 'richTextEditor';
}));