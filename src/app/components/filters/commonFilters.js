(function () {
	'use strict';
	angular.module('commonFilters', [])
		.filter('getTicketID', function () {
		return function (ticketUrl) {
			if (!ticketUrl) {
				return "";
			}
            var arr = ticketUrl.split('/');
            if(arr[4]){
                return arr[4];
            }else{
                return ticketUrl;
            }
			
		};
	});
})();
