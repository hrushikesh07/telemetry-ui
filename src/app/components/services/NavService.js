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
            name: 'Instances',
            type: 'link',
            state: 'home.instances',
            icon: 'fa fa-fw fa-tachometer'
          },
            {
                name: 'Services',
                type: 'link',
                state: 'home.serviceSae',
                icon: 'fa fa-sellsy'
            },
          {
            name: 'Events',
            type: 'link',
            state: 'home.events',
            icon: 'fa fa-fw fa-bell'
          },
          {
            name: 'Remediation',
            type: 'link',
            state: 'home.remediation',
            icon: 'fa fa-fw fa-shield'
          },
          {
            name: 'SAE',
            type: 'link',
            state: 'home.sae',
            icon: 'fa fa-fw fa-area-chart'
          }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
