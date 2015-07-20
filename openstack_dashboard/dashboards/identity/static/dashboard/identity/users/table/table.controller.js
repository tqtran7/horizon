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
   * @ngdoc identityUsersTableController
   * @ngController
   *
   * @description
   * Controller for the identity users table.
   * Serve as the focal point for table actions.
   */
  angular
    .module('hz.dashboard.identity.users')
    .controller('identityUsersTableController', identityUsersTableController);

  identityUsersTableController.$inject = [
    '$scope',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.openstack-service-api.policy',
    'horizon.openstack-service-api.keystone',
    'hz.dashboard.identity.basePath',
    'horizon.framework.widgets.modal.wizard-modal.service'
  ];

  // list of available actions in this table
  // here we are overriding the controller option
  // see modalService for list of other options
  var actions = {
    create: { controller: 'identity.users.create-workflow.controller' }
  };

  function identityUsersTableController(
    $scope,
    toast,
    gettext,
    policy,
    keystone,
    basepath,
    createService) {

    var ctrl = this;
    ctrl.users = [];
    ctrl.iusers = [];
    ctrl.userSession = {};
    ctrl.checked = {};
    ctrl.path = basepath + 'users/table/';
    ctrl.actions = actions;

    init();

    // we need to bind actions to scope
    // because action directive reads from scope
    $scope.actions = ctrl.actions;

    ////////////////////////////////

    function init() {
      // if user has permission
      // fetch table data and populate it
      var rules = [['identity', 'identity:list_users']];
      policy.check({ rules: rules }).success(policySuccess);

      // for each action in the hash
      // create a modalService out of it
      for (var key in ctrl.actions) {
        ctrl.actions[key] = createService.init(ctrl.actions[key]);
      }
    };

    function policySuccess(response) {
      if (response.allowed) {
        keystone.getUsers().success(getUsersSuccess);
        keystone.getCurrentUserSession().success(getSessionSuccess);
      }
      else {
        var msg = gettext('Insufficient privilege level to view user information.');
        toast.add('info', msg);
      }
    }

    function getUsersSuccess(response) {
      ctrl.users = response.items;
    }

    function getSessionSuccess(response) {
      ctrl.userSession = response;
    }
  }

})();
