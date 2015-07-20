/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc controller
   * @name 'identity.users.workflows.select-project.controller'
   * @description
   * Fetches the project list and assign default project to user.
   * Uses scope so it can be shared with parent controller.
   */
  angular
    .module('hz.dashboard.identity.users')
    .controller('identity.users.workflows.select-project.controller', controller);

  controller.$inject = [
    '$scope', 'horizon.openstack-service-api.keystone'
  ];

  function controller($scope, keystoneAPI) {

    var ctrl = this;

    init();

    ///////////////////////////

    function init() {
      keystoneAPI.getProjects().success(success);
    }

    function success(response) {
      // acount for different keystone versions
      $scope.projects = response.items;
      $scope.user.project_id = (
        $scope.user.project_id ||
        $scope.user.tenantId ||
        $scope.user.default_project_id
      );
    }

    function allocate() {

    }

    function deallocate() {
      
    }

  } // end of controller

})();
