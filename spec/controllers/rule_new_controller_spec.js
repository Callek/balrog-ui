
describe("controller: NewRuleController", function() {

  beforeEach(function() {
    module("app");
  });

  var sample_rules = {
    "count": 55,
    "rules": [
      {
        "comment": "Comment",
        "product": null,
        "buildID": null,
        "backgroundRate": 100,
        "mapping": "No-Update",
        "rule_id": 19,
        "priority": 1,
        "data_version": 9,
        "version": null,
        "headerArchitecture": null,
        "update_type": "minor",
        "buildTarget": null,
        "locale": null,
        "osVersion": null,
        "distribution": null,
        "channel": "nightly",
        "distVersion": null
    },
    {
        "comment": null,
        "product": "GMP",
        "buildID": null,
        "backgroundRate": 100,
        "mapping": "GMP-Firefox33-201410010830",
        "rule_id": 67,
        "priority": 10,
        "data_version": 2,
        "version": ">=33.0",
        "headerArchitecture": null,
        "update_type": "minor",
        "buildTarget": null,
        "locale": null,
        "osVersion": null,
        "distribution": null,
        "channel": null,
        "distVersion": null
    }
    ]
  };

  var sample_revisions = {
    count: 2,
    rules: [
      {
        "build_id": null,
        "comment": "Comment",
        "product": null,
        "change_id": 59,
        "os_version": null,
        "locale": null,
        "timestamp": 1384364357223,
        "changed_by": "bhearsum@mozilla.com",
        "mapping": "No-Update",
        "priority": 1,
        "data_version": 1,
        "version": null,
        "background_rate": 100,
        "dist_version": null,
        "header_arch": null,
        "distribution": null,
        "build_target": null,
        "id": 19,
        "channel": null,
        "update_type": "minor"
      },
      {
        "build_id": null,
        "comment": "Comment",
        "product": null,
        "change_id": 59,
        "os_version": null,
        "locale": null,
        "timestamp": 1384364357223,
        "changed_by": "bhearsum@mozilla.com",
        "mapping": "No-Update",
        "priority": 1,
        "data_version": 1,
        "version": null,
        "background_rate": 100,
        "dist_version": null,
        "header_arch": null,
        "distribution": null,
        "build_target": null,
        "id": 19,
        "channel": null,
        "update_type": "minor"
      }
    ]
  };

  var rules = sample_rules.rules;
  var rule = {
    product: '',
    backgroundRate: 0,
    priority: 0,
    update_type: 'minor',
    _duplicate: false,
  };

  beforeEach(inject(function($controller, $rootScope, $location, $modal, Rules, Releases, $httpBackend) {
    this.$location = $location;
    this.$httpBackend = $httpBackend;
    this.scope = $rootScope.$new();
    // this.redirect = spyOn($location, 'path');

    $controller('NewRuleCtrl', {
      $scope: this.scope,
      $modalInstance: $modal.open({
        templateUrl: 'rule_modal.html'
      }),
      $location: $location,
      Rules: Rules,
      Releases: Releases,
      rules: rules,
      rule: rule,
    });
  }));

  afterEach(function() {
    this.$httpBackend.verifyNoOutstandingRequest();
    this.$httpBackend.verifyNoOutstandingExpectation();
  });

  describe("opening the new rule modal", function() {

    it("should should all defaults", function() {
      this.$httpBackend.expectGET('/api/releases?names_only=1')
      .respond(200, JSON.stringify({names: ['Name1', 'Name2']}));
      this.$httpBackend.flush();
      expect(this.scope.names).toEqual(['Name1', 'Name2']);
      expect(this.scope.errors).toEqual({});
      expect(this.scope.saving).toEqual(false);
      expect(this.scope.rule).toEqual(rule);
      expect(this.scope.rule.product).toEqual('');
      expect(this.scope.rules).toEqual(rules);
      expect(this.scope.is_edit).toEqual(false);
      expect(this.scope.is_duplicate).toEqual(false);
    });

    it("should should be able to save changes", function() {
      this.$httpBackend.expectGET('/api/releases?names_only=1')
      .respond(200, JSON.stringify({names: ['Name1', 'Name2']}));
      this.$httpBackend.expectGET('/api/csrf_token')
      .respond(200, 'token');
      this.$httpBackend.expectPOST('/api/rules')
      .respond(201, '123');

      this.scope.rule.product = 'Something';
      this.scope.saveChanges();
      expect(this.scope.saving).toEqual(true);
      this.$httpBackend.flush();

      expect(this.scope.rule.data_version).toEqual(1);
      expect(this.scope.rule.rule_id).toEqual(123);
      expect(this.scope.rules.length).toEqual(3);
      expect(this.scope.saving).toEqual(false);
      expect(this.scope.errors).toEqual({});
    });

    it("should should throw sweetAlert on error", function() {
      this.$httpBackend.expectGET('/api/releases?names_only=1')
      .respond(200, JSON.stringify({names: ['Name1', 'Name2']}));
      this.$httpBackend.expectGET('/api/csrf_token')
      .respond(200, 'token');
      this.$httpBackend.expectPOST('/api/rules')
      .respond(400, '{"error": "one"}');

      this.scope.rule.product = 'Something';
      this.scope.saveChanges();
      expect(this.scope.saving).toEqual(true);
      this.$httpBackend.flush();

      expect(this.scope.errors).toEqual({error: 'one'});
      expect(this.scope.saving).toEqual(false);
    });

  });

});
