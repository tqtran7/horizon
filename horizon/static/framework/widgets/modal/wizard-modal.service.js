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
   * @ngDoc hz.framework.wizard.modal.service
   * @ngFactory
   *
   * @Description
   * The way angular-bootstrap modal work is a bit strange.
   * You have $modal in controller A which you can use to open to controller B.
   * You have $modalInstance in controller B spawn, which you can use to close or dismiss.
   * Upon closing, you can choose to pass information back to controller A.
   * The dismiss method does nothing.
   *
   * This is a problem because it requires us to define controller A for open.
   * And it also forces controller B to define close and dismiss.
   * The result is a bunch of controllers just to open a modal dialog.
   *
   * This service aims to simplify that by centralizing open, close, and dismiss.
   * It also provides some default options that you must override via init.
   * The override MUST contain a controller.
   *
   * @Example
   *
   * app.controller('tableController', function(modalService){
   *   modalService.init({ controller: 'wizardController' }).open();
   * });
   *
   * app.controller('wizardController', function($scope, $modalInstance, modalService){
   *   $scope.close = modalService.close($modalInstance);
   *   $scope.cancel = modalService.cancel($modalInstance);
   *   $scope.submit = function(){....};
   *   $scope.workflow = workflow({
   *     title: 'Title',
   *     steps: [...]
   *   });
   * });
   *
   */
  angular
    .module('horizon.framework.widgets.modal')
    .factory('horizon.framework.widgets.modal.wizard-modal.service', modalService);

  modalService.$inject = ['$modal'];

  function modalService($modal) {

    var service = {
      open: open,
      close: close,
      cancel: cancel,
      init: init
    };
    return service;

    ///////////////////////////////

    function init(options) {
      service.options = angular.extend(options, {
        controllerAs: 'ctrl',
        template: '<wizard></wizard>',
        backdrop: 'static',
        windowClass: 'modal-dialog-wizard',
        resolve: { modalService: self }
      });
      return service;
    }

    function self() {
      return service;
    }

    function open() {
      $modal.open(service.options);
    }

    function close($modalInstance) {
      return function() {
        $modalInstance.close();
      };
    }

    function cancel($modalInstance) {
      return function() {
        $modalInstance.dismiss('cancel');
      };
    }
  }

})();
