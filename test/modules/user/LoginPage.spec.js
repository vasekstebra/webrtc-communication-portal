import React from 'react';
import { shallow } from 'enzyme';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { LoginPage } from '../../../src/modules/user/LoginPage';

const renderLoginPage = () => shallow(<LoginPage onLogin={() => {}} />);

function verifyLoginFields(textFields) {
  const emailField = textFields.at(0);
  const passwordField = textFields.at(1);

  expect(emailField.prop('hintText')).to.equal(
    'Please enter your email address',
    'Invalid hint for email field'
  );
  expect(emailField.prop('floatingLabelText')).to.equal(
    'Email',
    'Invalid floating label for email field'
  );
  expect(passwordField.prop('hintText')).to.equal(
    'Please enter your password',
    'Invalid hint for password field'
  );
  expect(passwordField.prop('floatingLabelText')).to.equal(
    'Password',
    'Invalid floating label for password field'
  );
  expect(passwordField.prop('type')).to.equal('password', 'Password field has invalid type');
}

describe('LoginPage', () => {
  it('has heading Login', () => {
    const element = renderLoginPage();

    const heading = element.find('h1').at(0);

    expect(heading.text()).to.equal('Login', 'Login page has wrong heading');
  });

  it('has fields for email and password', () => {
    const element = renderLoginPage();

    const textFields = element.find(TextField);

    expect(textFields).to.have.length(2, 'Incorrect number of TextFields on login page');
    verifyLoginFields(textFields);
  });

  it('has Log in button', () => {
    const element = renderLoginPage();

    const button = element.find(RaisedButton).at(0);

    expect(button.prop('label')).to.equal('Log in', 'Log in button not present or invalid label');
    expect(button.prop('primary')).to.equal(true, 'Log in button is not primary');
  });

  it('has Sign up button', () => {
    const element = renderLoginPage();

    const button = element.find(RaisedButton).at(1);

    expect(button.prop('label')).to.equal('Sign up', 'Sign up button not present or invalid label');
    expect(button.prop('secondary')).to.equal(true, 'Sign up button is not secondary');
  });

  it('has Back button', () => {
    const element = renderLoginPage();

    const button = element.find(RaisedButton).at(2);

    expect(button.prop('label')).to.equal('Back', 'Back button not present or invalid label');
    expect(button.prop('containerElement').type.name).to.equal(
      'Link',
      'Back button is not link'
    );
    expect(button.prop('containerElement').props.to).to.equal(
      '/',
      'Back link points to wrong location'
    );
  });
});