const PropertyRadioView = require('style_manager/view/PropertyRadioView');
const Property = require('style_manager/model/Property');
const Component = require('dom_components/model/Component');

module.exports = {
  run() {

      describe('PropertyRadioView', () => {

        var component;
        var fixtures;
        var target;
        var model;
        var view;
        var propTarget;
        var propName = 'testprop';
        var propValue = 'test1value';
        var defValue = 'test2value';
        var options = [
              { value: 'test1value', 'title': 'testtitle'},
              { name: 'test2', value: 'test2value'}
            ];

        // Have some issue with getCheckedEl() and jsdom
        // this view.getInputEl().querySelector('input:checked') return null
        // but view.getInputEl().querySelectorAll('input:checked')[0] works
        var getCheckedEl = (view) => view.getInputEl().querySelectorAll('input:checked')[0];

        beforeEach(() => {
          target = new Component();
          component = new Component();
          model = new Property({
            type: 'radio',
            list: options,
            property: propName
          });
          propTarget = Object.assign({}, Backbone.Events);
          propTarget.model = component;
          view = new PropertyRadioView({
            model,
            propTarget
          });
          document.body.innerHTML = '<div id="fixtures"></div>';
          fixtures = document.body.firstChild;
          view.render();
          fixtures.appendChild(view.el);
        });

        afterEach(() => {
          //view.remove(); // strange errors ???
        });

        after(() => {
          component = null;
        });

        it('Rendered correctly', () => {
          var prop = view.el;
          expect(fixtures.querySelector('.property')).toExist();
          expect(prop.querySelector('.label')).toExist();
          expect(prop.querySelector('.field')).toExist();
        });

        it('Radio rendered', () => {
          var prop = view.el;
          expect(prop.querySelector('input[type=radio]')).toExist();
        });

        it('Options rendered', () => {
          var input = view.el.querySelector('.field').firstChild;
          expect(input.children.length).toEqual(options.length);
        });

        it('Options rendered correctly', () => {
          var children = view.el.querySelector('.field').firstChild.children;
          expect(children[0].querySelector('label').textContent).toEqual('test1value');
          expect(children[1].querySelector('label').textContent).toEqual('test2');
          expect(children[0].querySelector('input').value).toEqual(options[0].value);
          expect(children[1].querySelector('input').value).toEqual(options[1].value);
          expect(children[0].querySelector('label').getAttribute('title')).toEqual(options[0].title);
          expect(children[1].querySelector('label').getAttribute('title')).toEqual(null);
        });

        it('Input should exist', () => {
          expect(view.input).toExist();
        });

        it('Input value is empty', () => {
          expect(view.model.get('value')).toNotExist();
        });

        it('Update model on input change', () => {
          view.setValue(propValue);
          expect(getCheckedEl(view).value).toEqual(propValue);
        });

        it('Update input on value change', () => {
          view.model.set('value', propValue);
          expect(getCheckedEl(view).value).toEqual(propValue);
        });

        it('Update target on value change', () => {
          view.selectedComponent = component;
          view.model.set('value', propValue);
          var compStyle = view.selectedComponent.get('style');
          var assertStyle = {};
          assertStyle[propName] = propValue;
          expect(compStyle).toEqual(assertStyle);
        });

        describe('With target setted', () => {

          beforeEach(() => {
            target.model = component;
            view = new PropertyRadioView({
              model,
              propTarget: target
            });
            fixtures.innerHTML = '';
            view.render();
            fixtures.appendChild(view.el);
          });

          it('Update value and input on target swap', () => {
            var style = {};
            style[propName] = propValue;
            component.set('style', style);
            view.propTarget.trigger('update');
            expect(view.model.get('value')).toEqual(propValue);
            expect(getCheckedEl(view).value).toEqual(propValue);
          });

          it('Update value after multiple swaps', () => {
            var style = {};
            style[propName] = propValue;
            component.set('style', style);
            view.propTarget.trigger('update');
            style[propName] = 'test2value';
            component.set('style', style);
            view.propTarget.trigger('update');
            expect(view.model.get('value')).toEqual('test2value');
            expect(getCheckedEl(view).value).toEqual('test2value');
          });

        })

        describe('Init property', () => {

          beforeEach(() => {
            component = new Component();
            model = new Property({
              type: 'select',
              list: options,
              defaults: defValue,
              property: propName
            });
            view = new PropertyRadioView({
              model
            });
            fixtures.innerHTML = '';
            view.render();
            fixtures.appendChild(view.el);
          });

          it('Value as default', () => {
            expect(view.model.get('value')).toEqual(defValue);
          });

          it('Input value is as default', () => {
            expect(view.model.getDefaultValue()).toEqual(defValue);
          });

        });

    });
  }
};
