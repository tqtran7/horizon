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

  describe('Wizard modal service', function() {

    var modal, modalInstance, modalService;
    var options = {
      controller: 'testController',
      controllerAs: 'controller',
      template: '<hello></hello>',
      backdrop: 'backdrop',
      windowClass: 'window'
    };

    beforeEach(module('horizon.framework.widgets.modal'));
    beforeEach(module(function($provide) {
      modal = { open: angular.noop };
      modalInstance = { close: angular.noop, dismiss: angular.noop };
      $provide.value('$modal', modal);
      $provide.value('$modalInstance', modalInstance);
    }));

    beforeEach(inject(function($injector) {
      modalService = $injector.get('horizon.framework.widgets.modal.wizard-modal.service');
    }));

    it('should exist', function() {
      expect(modalService).toBeDefined();
    });

    it('should contain essential fields', function() {
      var essentialFields = ['open', 'close', 'cancel', 'init'];
      angular.forEach(essentialFields, function(key, index) {
        expect(modalService[key]).toBeDefined();
      });
    });

    it('should extend options', function() {
      modalService.init(options);
      expect(modalService.options.resolve).toBeDefined();
      angular.forEach(options, function(value, key) {
        expect(modalService.options[key]).toEqual(value);
      });
    });

    beforeEach(inject(function($injector) {
      modalService.init({ controller: 'testController' });
      spyOn(modal, 'open');
      spyOn(modalInstance, 'close');
      spyOn(modalInstance, 'dismiss');
    }));

    it('should invoke $modal.open on open', function() {
      modalService.open();
      expect(modal.open).toHaveBeenCalled();
    });

    it('should invoke $modalInstance.close on close', function() {
      modalService.close(modalInstance)();
      expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should invoke $modalInstance.dismiss on cancel', function() {
      modalService.cancel(modalInstance)();
      expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

  });

})();
