import React from 'react';
import { shallow } from 'enzyme';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';

import CreateMeetingForm from '../../../../src/modules/meeting/components/CreateMeetingForm';

function renderCreateMeetingForm(actionInProgress = false) {
  return shallow(<CreateMeetingForm
    actionInProgress={actionInProgress}
    onSubmit={() => {}}
  />);
}

describe('Meeting module', () => {
  describe('CreateMeetingForm', () => {
    it('has fields for title', () => {
      const element = renderCreateMeetingForm();

      const textFields = element.find(TextField);

      expect(textFields).to.have.length(1);

      const titleField = textFields.at(0);

      expect(titleField.prop('hintText')).to.equal('Title of the meeting');
      expect(titleField.prop('floatingLabelText')).to.equal('Title');
    });

    it('has field for start and end time', () => {
      const element = renderCreateMeetingForm();

      const datePickers = element.find(DatePicker);
      const timePickers = element.find(TimePicker);

      expect(datePickers).to.have.length(2);
      expect(timePickers).to.have.length(2);

      const startDatePicker = datePickers.at(0);
      const startTimePicker = timePickers.at(0);
      const endDatePicker = datePickers.at(1);
      const endTimePicker = timePickers.at(1);

      expect(startDatePicker.prop('hintText')).to.equal('Start date');
      expect(startTimePicker.prop('hintText')).to.equal('Start time');
      expect(endDatePicker.prop('hintText')).to.equal('End date');
      expect(endTimePicker.prop('hintText')).to.equal('End time');
    });

    it('has submit button', () => {
      const element = renderCreateMeetingForm();

      const button = element.find(RaisedButton).at(0);

      expect(button.prop('label')).to.equal('Plan new meeting');
      expect(button.prop('primary')).to.equal(true);
    });

    it('has disabled action button when action is in progress', () => {
      const element = renderCreateMeetingForm(true);

      const button = element.find(RaisedButton).at(0);

      expect(button.prop('disabled')).to.equal(true);
    });
  });
});
