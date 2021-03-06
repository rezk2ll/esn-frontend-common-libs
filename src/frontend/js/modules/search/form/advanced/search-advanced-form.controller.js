require('../../context/search-context.service.js');
require('../../query/search-query.service.js');

(function(angular) {
  'use strict';

  angular.module('esn.search').controller('ESNSearchAdvancedFormController', ESNSearchAdvancedFormController);

  function ESNSearchAdvancedFormController(
    $stateParams,
    $rootScope,
    esnSearchContextService,
    esnSearchQueryService,
    esnI18nService
  ) {
    var self = this;

    self.$onInit = $onInit;
    self.$onDestroy = $onDestroy;
    self.clearSearchQuery = clearSearchQuery;
    self.clearAdvancedQuery = clearAdvancedQuery;
    self.onProviderSelected = onProviderSelected;
    self.doSearch = doSearch;

    var removeStateListener = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      // update the providers from the state
      // avoid to change when we go to search state
      if (esnSearchQueryService.shouldKeepSearch(toState, toParams, fromState, fromParams)) {
        loadProviders();

        return;
      }

      if (toState.name !== 'search.main') {
        clearSearchQuery();
        loadProviders();
      } else {
        // For some reason it will not work if not set when coming back from a search result...
        self.searchQuery = esnSearchQueryService.buildFromState($stateParams);
        loadProviders();
      }
    });

    function $onInit() {
      self.searchQuery = esnSearchQueryService.buildFromState($stateParams);
      loadProviders();
    }

    function $onDestroy() {
      removeStateListener();
    }

    function loadProviders() {
      esnSearchContextService.getProvidersContext().then(function(providers) {
        self.providers = providers;

        self.selectedProvider = undefined;

        var activeProviders = (self.providers || []).filter(function(provider) {
          return provider.active;
        });

        if (activeProviders.length) {
          self.selectedProvider = activeProviders[0];
        }

        onProviderSelected(self.selectedProvider);
      });
    }

    function clearSearchQuery() {
      esnSearchQueryService.clear(self.searchQuery);
    }

    function clearAdvancedQuery() {
      esnSearchQueryService.clearAdvancedQuery(self.searchQuery);
    }

    function onProviderSelected(provider) {
      // TODO: Write tests for this (https://github.com/OpenPaaS-Suite/esn-frontend-common-libs/issues/110)
      if (self.provider && provider && self.provider.id !== provider.id) {
        clearAdvancedQuery();
      }

      self.provider = provider;
      self.placeHolder = esnI18nService.translate((provider && provider.placeHolder) || 'Search').toString();
    }

    function doSearch(query) {
      self.search({ query: query, provider: self.provider || null });
    }
  }
})(angular);
