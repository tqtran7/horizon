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
   * @name identity.users.create-workflow.controller
   * @description
   *
   */
  angular
    .module('hz.dashboard.identity.users')
    .controller('identity.users.create-workflow.controller', controller);

  controller.$inject = [
    '$modalInstance',
    '$scope',
    'horizon.app.core.workflow.factory',
    'horizon.framework.widgets.modal.wizard-modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.openstack-service-api.keystone',
    'hz.dashboard.identity.basePath'
  ];

  function controller(
    $modalInstance,
    $scope,
    workflowService,
    modalService,
    toastService,
    keystoneAPI,
    path) {

    $scope.close = modalService.close($modalInstance);
    $scope.cancel = modalService.cancel($modalInstance);
    $scope.submit = submit;
    $scope.workflow = getWorkflow();

    ///////////////////////////

    function getWorkflow() {
      return workflowService({
        title: 'Create User in Domain #x',
        btnText: { finish: 'Create User' },
        steps: [
          {
            title: 'User Details',
            templateUrl: path + 'users/workflows/create-user/create-user.html',
            helpUrl: path + 'users/workflows/create-user/create-user.help.html',
            formName: 'createUsersForm'
          },
          {
            title: 'Select Project',
            templateUrl: path + 'users/workflows/select-project/select-project.html',
            helpUrl: path + 'users/workflows/select-project/select-project.help.html',
            formName: 'select-project-form'
          }
        ]
      });
    }

    function submit() {
      return keystoneAPI.createUser($scope.user)
        .success(success)
        .then(lastly);
    }

    function success(response) {
      //scope.users.push(response);
      var message = gettext('User %s was successfully created.');
      toastService.add('success', interpolate(message, [$scope.user.name]));
    }

    function lastly(){
      console.log("lastly");
      delete $scope.user.password;
      delete $scope.user.cpassword;
    }

  } // end of controller

})();
