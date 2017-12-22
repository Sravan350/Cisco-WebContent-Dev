!function(){"use strict";angular.module("cisco.formly",["cisco.formly.forms","cisco.formly.tpls"])}(),function(){"use strict";angular.module("cisco.formly.forms",["formly"],["formlyConfigProvider","formlyApiCheck",function(formlyConfigProvider,formlyApiCheck){function getFieldTemplateUrl(name){return"src/formly/formly-field-"+name+".tpl.html"}formlyConfigProvider.setWrapper([{name:"ciscoWrapper",templateUrl:"src/formly/formly-wrapper.tpl.html"},{name:"ciscoLabel",templateUrl:"src/formly/formly-wrappers-label.tpl.html"},{name:"ciscoHasError",templateUrl:"src/formly/formly-wrappers-has-error.tpl.html"},{name:"ciscoLoading",templateUrl:"src/formly/formly-wrappers-loading.tpl.html"},{name:"countryListWrapper",templateUrl:"src/formly/formly-wrappers-countrylist.tpl.html"}]);var commonWrappers=["ciscoWrapper"];angular.forEach(["radio-list","select","cs-input-deprecated","file","combobox","datepicker"],function(fieldName){formlyConfigProvider.setType({name:fieldName,templateUrl:getFieldTemplateUrl(fieldName),wrapper:commonWrappers})}),formlyConfigProvider.setType({name:"cs-input",templateUrl:getFieldTemplateUrl("cs-input"),controller:["$scope",function($scope){function getFormControl(){if($scope.options){if(angular.isArray($scope.options.formControl)&&$scope.options.formControl.length>0)return $scope.options.formControl[0];if(angular.isObject($scope.options.formControl))return $scope.options.formControl}return{}}$scope.getFormControl=getFormControl}]}),formlyConfigProvider.setType({name:"input",templateUrl:getFieldTemplateUrl("cs-input-deprecated"),wrapper:commonWrappers}),formlyConfigProvider.setType({name:"textarea",template:'<textarea class="form-control" ng-model="model[options.key]"></textarea>',wrapper:commonWrappers,defaultOptions:{data:{ngModelAttributes:{rows:"rows",cols:"cols"}}}}),formlyConfigProvider.setType({name:"inline",templateUrl:getFieldTemplateUrl("inline"),defaultOptions:{noFormControl:!0},controller:["$scope",function($scope){$scope.$watch("model",function(){angular.forEach($scope.to.fields,function(field){field.runExpressions&&field.runExpressions()})},!0)}]}),formlyConfigProvider.setType({name:"checkbox",templateUrl:getFieldTemplateUrl("checkbox"),wrapper:["ciscoHasError"]}),formlyConfigProvider.setType({name:"countrylist","extends":"cs-input-deprecated",templateUrl:getFieldTemplateUrl("countrylist"),wrapper:["countryListWrapper"]}),formlyConfigProvider.setType({name:"radio",templateUrl:getFieldTemplateUrl("radio"),wrapper:["ciscoHasError"]}),formlyConfigProvider.setType({name:"repeater",templateUrl:getFieldTemplateUrl("repeater"),wrapper:commonWrappers,controller:["$scope",function($scope){function copyFields(fields){return angular.copy(fields)}$scope.formOptions={formState:$scope.formState},$scope.copyFields=copyFields}]}),formlyConfigProvider.setType({name:"button",template:'<button cs-btn loading="to.loading" type="button" ng-class="to.btnClass" ng-click="to.onClick(options, this)" ng-disabled="to.disabled"><span ng-class="to.spanClass">{{::to.label}}</span></button>'}),formlyConfigProvider.setType({name:"link",template:'<a href="" ng-click="to.onClick(options, this)">{{::to.label}}</a>'}),formlyConfigProvider.setType({name:"nested",template:'<formly-form model="model[options.key]" fields="options.data.fields"></formly-form>',wrapper:commonWrappers}),formlyConfigProvider.setType({name:"switch",template:'<cs-toggle-switch ng-model="model[options.key]" toggle-id="{{::options.key}}" name="toggleSwitch" is-disabled="{{to.isDisabled}}"></cs-toggle-switch>',wrapper:commonWrappers}),formlyConfigProvider.setType({name:"icon-button",template:'<i ng-class="to.btnClass" ng-click="to.onClick(options, this)"></i>',wrapper:commonWrappers})}]),angular.module("cisco.formly.forms").run(["formlyConfig","formlyValidationMessages",function(formlyConfig,formlyValidationMessages){formlyConfig.extras.ngModelAttrsManipulatorPreferBound=!0,formlyValidationMessages.addStringMessage("needed","This field is required")}])}(),function(){angular.module("cisco.formly.tpls",[]).run(["$templateCache",function($templateCache){$templateCache.put("src/formly/formly-field-checkbox.tpl.html",'<cs-checkbox ckid="{{options.templateOptions.id}}" ng-model="model[options.key]" label="{{options.templateOptions.label}}" isdisabled="options.templateOptions.disabled" ng-class="options.templateOptions.class"></cs-checkbox>'),$templateCache.put("src/formly/formly-field-combobox.tpl.html",'<cs-combobox\n  id="options.key"\n  name="{{::options.key}}"\n  options="options"\n  list="options.templateOptions.list"\n  addtext="options.templateOptions.addtext"\n  ng-model="model[options.key]"\n  required="options.templateOptions.required">\n</cs-combobox>'),$templateCache.put("src/formly/formly-field-countrylist.tpl.html",'<cs-country-select \n    name="{{::options.key}}"\n    ng-model="model[options.key]"\n    placeholder="options.templateOptions.placeholder"\n    options="options.templateOptions.options"\n    required="options.templateOptions.required"\n    is-disabled="options.templateOptions.disabled"\n    max-length="options.templateOptions.maxLength">\n  </cs-country-select>'),$templateCache.put("src/formly/formly-field-cs-input-deprecated.tpl.html",'  <cs-input-deprecated type="{{options.templateOptions.type}}"\n  id="options.key"\n  formly-dynamic-name="options.key"\n  placeholder="{{::options.templateOptions.placeholder}}"\n  aria-describedby="{{id}}_description"\n  is-required="options.templateOptions.required"\n  is-disabled="options.templateOptions.disabled"\n  ng-model="model[options.key]"\n  is-error="{{options.templateOptions.isError}}"\n  error-msg="{{options.templateOptions.errorMsg}}"\n  is-warn="{{options.templateOptions.isWarn}}"\n  warn-msg="{{options.templateOptions.warnMsg}}"></cs-input-deprecated>'),$templateCache.put("src/formly/formly-field-cs-input.tpl.html",'<div class="row" ng-if="to.type !== \'radio\'">\n  <div class="cs-input-group" ng-class="{\'error\': showError, \'warning\': to.warning}">\n    <input\n      cs-input\n      cs-input-formly="true"\n      type="{{::to.type}}"\n      name="{{::options.key}}"\n      id="{{::options.key}}"\n      ng-model="model[options.key]"\n      ng-class="to.inputClass"\n      placeholder="{{::to.placeholder}}"\n      cs-input-label="{{::to.label}}"\n      cs-input-help-text="{{::to.helpText}}"\n      cs-input-group-size="{{::to.groupSize}}"\n      cs-input-size="{{::to.size}}"\n      cs-input-secondary-label="{{::to.secondarylabel}}"\n      cs-input-warning="to.warning">\n    <div class="cs-input__messages" ng-messages="getFormControl().$error" role="alert">\n      <div class="message" ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">{{message(getFormControl().$viewValue, getFormControl().$modelValue, this)}}</div>\n      <div class="message" ng-if="to.warning">{{::to.warningMessage}}</div>\n    </div>\n  </div>\n</div>\n<div class="row" ng-if="to.type === \'radio\'">\n  <div class="cs-input-group cs-input-radio" ng-class="{\'error\': showError, \'warning\': to.warning}">\n    <input\n      cs-input\n      cs-input-formly="true"\n      type="{{::to.type}}"\n      name="{{::to.name}}"\n      id="{{::options.key}}"\n      ng-model="model[options.templateOptions.model]"\n      ng-value="{{::to.value}}"\n      ng-class="to.inputClass"\n      placeholder="{{::to.placeholder}}"\n      cs-input-label="{{::to.label}}"\n      cs-input-help-text="{{::to.helpText}}"\n      cs-input-group-size="{{::to.groupSize}}"\n      cs-input-warning="to.warning">\n    <div class="cs-input__messages" ng-messages="getFormControl().$error" role="alert">\n      <div class="message" ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">{{message(getFormControl().$viewValue, getFormControl().$modelValue, this)}}</div>\n      <div class="message" ng-if="to.warning">{{::to.warningMessage}}</div>\n    </div>\n  </div>\n</div>'),$templateCache.put("src/formly/formly-field-datepicker.tpl.html",'<cs-datepicker\n	id="{{::options.key}}"\n	formly-dynamic-name="options.key"\n	formly-custom-validation="options.validators"\n	aria-describedby="{{id}}_description"\n	ng-required="options.templateOptions.required"\n	ng-disabled="options.templateOptions.disabled"\n	ng-model="model[options.key]"\n	placeholder="{{::options.templateOptions.placeholder}}">\n</cs-datepicker>'),$templateCache.put("src/formly/formly-field-file.tpl.html",'<input type="file" id="{{options.templateOptions.id}}">\n'),$templateCache.put("src/formly/formly-field-inline.tpl.html",'  <div formly-field\n       ng-repeat="field in to.fields track by $index"\n       ng-if="!field.hide"\n       ng-class="field.className"\n       class="form-inline formly-field {{field.type ? \'formly-field-\' + field.type : \'\'}}"\n       options="field"\n       model="field.model || model"\n       fields="fields"\n       form="form"\n       form-id="formId"\n       form-state="options.formState"\n       index="$index">\n  </div>\n'),$templateCache.put("src/formly/formly-field-radio-list.tpl.html",'<cs-radio ng-repeat="(key, option) in options.templateOptions.options" label="option.label" value="option.value" name="{{::options.key}}" id="option.id" ng-model="model[options.key]" isdisabled="option.disabled" horizontal="options.templateOptions.horizontal"></cs-radio>'),$templateCache.put("src/formly/formly-field-radio.tpl.html",'<cs-radio\n  label="options.templateOptions.label"\n  value="options.templateOptions.value"\n  name="{{::options.key}}"\n  id="options.key"\n  ng-model="model[options.templateOptions.model]"\n  isdisabled="options.templateOptions.disabled"\n  horizontal="options.horizontal">\n</cs-radio>'),$templateCache.put("src/formly/formly-field-repeater.tpl.html",'<div>\n  <!--loop through each element in model array-->\n  <div ng-repeat="element in model[options.key]" ng-init="fields = copyFields(to.fields)">\n    <formly-form\n      fields="fields"\n      model="element"\n      options="{formState: {formIndex: $index}}"\n      bind-name="\'formly_ng_repeat\' + index + $parent.$index">\n    </formly-form>\n  </div>\n</div>'),$templateCache.put("src/formly/formly-field-select.tpl.html",'<cs-select\n  name="{{::options.key}}"\n  ng-model="model[options.key]"\n  options="options.templateOptions.options"\n  labelfield="{{::options.templateOptions.labelfield}}"\n  valuefield="{{::options.templateOptions.valuefield}}"\n  formly-custom-validation="options.validators"\n  placeholder="options.templateOptions.placeholder"\n  input-placeholder="options.templateOptions.inputPlaceholder"\n  aria-describedby="{{id}}_description"\n  cs-required="options.templateOptions.required"\n  is-disabled="options.templateOptions.disabled"\n  filter="{{::options.templateOptions.filter}}"\n  refresh-data-fn="options.templateOptions.refreshDataFn(filter)"\n  wait-time="{{::options.templateOptions.waitTime}}"\n  combo="{{::options.templateOptions.combo}}"\n  searchable-combo="{{::options.templateOptions.searchableCombo}}"\n  multi="{{::options.templateOptions.waitTime}}"\n  singular="{{::options.templateOptions.singular}}"\n  plural="{{::options.templateOptions.plural}}"\n  max="options.templateOptions.max"\n  error-msg="{{::options.templateOptions.errorMsg}}"\n  is-error="{{options.templateOptions.isError}}"\n  warn-msg="{{::options.templateOptions.warnMsg}}"\n  is-warn="{{options.templateOptions.isWarn}}"\n  on-change-fn="options.templateOptions.onChangeFn()">\n</cs-select>\n'),$templateCache.put("src/formly/formly-other-addons.tpl.html",'<div ng-class="{\'input-group\': to.addonLeft || to.addonRight}">\n    <div class="input-group-addon" ng-if="to.addonLeft">\n        <i class="{{to.addonLeft.class}}" ng-if="to.addonLeft.class"></i>\n        <span ng-if="to.addonLeft.text">{{to.addonLeft.text}}</span>\n    </div>\n    <formly-transclude></formly-transclude>\n    <div class="input-group-addon" ng-if="to.addonRight">\n        <i class="{{to.addonRight.class}}" ng-if="to.addonRight.class"></i>\n        <span ng-if="to.addonRight.text">{{to.addonRight.text}}</span>\n    </div>\n</div>'),$templateCache.put("src/formly/formly-wrapper.tpl.html",'<div class="formly-template-wrapper form-group" ng-class="{\'has-error has-feedback\': showError, \'row\': to.inputClass.indexOf(\'col-\') > -1}">\n  <label for="{{id}}" class="control-label" ng-class="to.labelClass" ng-if="to.label">\n    {{to.label}}\n  </label>\n  <p id="{{id}}_description" class="description-block" ng-if="to.description">{{to.description}}</p>\n  <div class="formly-input-wrapper" ng-class="to.inputClass">\n    <formly-transclude></formly-transclude>\n    <span class="validation form-control-feedback" ng-if="showError"\n    ng-messages="options.formControl.$error" error-popover>\n      <i class="icon icon-warning" ng-click="ep.changePopoverState()"></i>\n      <div class="popover top" ng-show="ep.errorPopoverOpen">\n        <div class="arrow"></div>\n        <div class="popover-inner">\n          <div class="popover-content">\n            <ul>\n              <li ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">\n                {{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </span>\n    <span class="secondary-label" ng-if="::to.secondaryLabel">{{::to.secondaryLabel}}</span>\n  </div>\n  <p class="help-block" ng-if="to.helpText">{{to.helpText}}</p>\n</div>\n'),$templateCache.put("src/formly/formly-wrappers-countrylist.tpl.html",'<div class="formly-template-wrapper form-group" ng-class="{\'has-error has-feedback\': showErrors && form[options.key].$invalid, \'row\': to.inputClass.indexOf(\'col-\') > -1}">\n  <label for="{{id}}" class="control-label" ng-class="to.labelClass" ng-if="to.label">\n    {{to.label}}\n  </label>\n  <p id="{{id}}_description" class="description-block" ng-if="to.description">{{to.description}}</p>\n  <div class="formly-input-wrapper" ng-class="to.inputClass">\n    <formly-transclude></formly-transclude>\n    <span class="validation form-control-feedback" ng-if="showErrors && form[options.key].$invalid"\n    ng-messages="form.$error" error-popover>\n    <i class="icon icon-warning" ng-click="ep.changePopoverState()"></i>\n      <div class="popover top" ng-show="ep.errorPopoverOpen">\n        <div class="arrow"></div>\n        <div class="popover-inner">\n          <div class="popover-content">\n            <ul>\n              <li ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">\n                {{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </span>\n  </div>\n</div>\n'),$templateCache.put("src/formly/formly-wrappers-has-error.tpl.html",'<div class="formly-template-wrapper form-group" ng-class="{\'has-error has-feedback\': options.validation.errorExistsAndShouldBeVisible}">\n  <formly-transclude></formly-transclude>\n  <span class="validation form-control-feedback" ng-if="options.validation.errorExistsAndShouldBeVisible"\n  ng-messages="options.formControl.$error" error-popover>\n    <i class="icon icon-warning" ng-click="ep.changePopoverState()"></i>\n    <div class="popover top" ng-show="ep.errorPopoverOpen">\n      <div class="arrow"></div>\n      <div class="popover-inner">\n          <div class="popover-content">\n            <ul>\n              <li ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">\n                {{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </span>\n</div>\n'),$templateCache.put("src/formly/formly-wrappers-label.tpl.html",'<label for="{{id}}" class="control-label" ng-class="options.templateOptions.labelClass" ng-if="options.templateOptions.label">\n  {{options.templateOptions.label}}\n</label>\n<div class="formly-input-wrapper" ng-class="options.templateOptions.inputClass">\n  <formly-transclude></formly-transclude>\n</div>\n'),$templateCache.put("src/formly/formly-wrappers-loading.tpl.html",'<div ng-if="to.loading.$$state.status === 0" style="line-height:34px">\n  Loading...\n</div>\n<div ng-if="to.loading.$$state.status !== 0">\n  <formly-transclude></formly-transclude>\n</div>\n')}])}();