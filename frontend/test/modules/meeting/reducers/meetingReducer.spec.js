import { meetingReducer } from '../../../../src/modules/meeting/reducers/meetingReducer';
import * as types from '../../../../src/modules/meeting/constants/ActionTypes';

const initialState = {
  data: {
    meetings: []
  },
  uiState: {
    fetchInProgress: false,
    fetchFailure: false
  }
};

const fetchInProgressState = {
  data: {
    meetings: []
  },
  uiState: {
    fetchInProgress: true,
    fetchFailure: false
  }
};

describe('Meeting module', () => {
  describe('reducers', () => {
    it('returns the initial state', () => {
      expect(meetingReducer(undefined, {})).to.deep.equal(initialState);
    });

    it('handles MEETINGS_FETCH_START', () => {
      const action = {
        type: types.MEETINGS_FETCH_START
      };

      expect(meetingReducer(initialState, action)).to.deep.equal({
        data: {
          meetings: []
        },
        uiState: {
          fetchInProgress: true,
          fetchFailure: false
        }
      });
    });

    it('handles MEETINGS_FETCH_FAILURE', () => {
      const action = {
        type: types.MEETINGS_FETCH_FAILURE
      };

      expect(meetingReducer(initialState, action)).to.deep.equal({
        data: {
          meetings: []
        },
        uiState: {
          fetchInProgress: false,
          fetchFailure: true
        }
      });
    });

    it('handles MEETINGS_FETCH_SUCCESS', () => {
      const action = {
        type: types.MEETINGS_FETCH_SUCCESS,
        meetings: [{
          id: 1,
          desc: 'meeting'
        }]
      };

      expect(meetingReducer(fetchInProgressState, action)).to.deep.equal({
        data: {
          meetings: [{
            id: 1,
            desc: 'meeting'
          }]
        },
        uiState: {
          fetchInProgress: false,
          fetchFailure: false
        }
      });
    });
  });
});
