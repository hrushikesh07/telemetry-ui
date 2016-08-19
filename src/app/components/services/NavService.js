(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
        {
            name: 'CatEye',
            type: 'link',
            state: 'home.cateye',
            icon: 'fa fa-fw fa-eye'
          },
          {
            name: 'Telemetry',
            type: 'link',
            state: 'home.telemetry',
            icon: 'fa fa-fw fa-tachometer'
          },
          {
            name: 'Adverse Events',
            type: 'link',
            state: 'home.adverse',
            icon: 'fa fa-fw fa-bell'
          },
          {
            name: 'Remediation',
            type: 'link',
            state: 'home.remediation',
            icon: 'fa fa-fw fa-shield'
          }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
