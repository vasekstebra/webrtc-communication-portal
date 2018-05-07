import io from 'socket.io-client';

import { API_URL } from '../../config/config';
import { addParticipant, removeParticipant } from '../modules/meeting/actions/participantsActions';
import { addChatMessage } from '../modules/meeting/actions/chatMessagesActions';

const participants = {};

function Participant(name, socket) {
  this.name = name;
  this.socket = socket;
  this.container = document.createElement('div');
  this.container.id = name;
  this.video = document.createElement('video');

  this.container.appendChild(this.video);
  document.getElementById('remote-streams').appendChild(this.container);

  this.video.id = `video-${name}`;
  this.video.autoplay = true;
  this.video.controls = false;

  this.getVideoElement = function () {
    return this.video;
  };

  this.offerToReceiveVideo = function (error, offerSdp) {
    if (error) {
      return console.error(error);
    }

    return this.socket.emit('message', {
      id: 'receiveVideoFrom',
      sender: name,
      sdpOffer: offerSdp
    });
  };

  this.onIceCandidate = function (candidate) {
    this.socket.emit('message', {
      id: 'onIceCandidate',
      candidate,
      sender: name
    });
  };

  Object.defineProperty(this, 'rtcPeer', { writable: true });

  this.dispose = function () {
    this.rtcPeer.dispose();
    this.container.parentNode.removeChild(this.container);
  };
}

function receiveVideo(socket, sender) {
  const participant = new Participant(sender, socket);
  participants[sender] = participant;
  const video = participant.getVideoElement();

  const options = {
    remoteVideo: video,
    onicecandidate: participant.onIceCandidate.bind(participant)
  };

  participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }

      return this.generateOffer(participant.offerToReceiveVideo.bind(participant));
    }
  );
}

function onNewParticipant(socket, message) {
  receiveVideo(socket, message.name);
}

function receiveVideoResponse(result) {
  participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, (error) => {
    if (error) {
      console.error(error);
    }
  });
}

function onExistingParticipants(socket, userId, message) {
  const constraints = {
    audio: true,
    video: {
      mandatory: {
        maxWidth: 320,
        maxFrameRate: 15,
        minFrameRate: 15
      }
    }
  };

  const participant = new Participant(userId, socket);
  participants[userId] = participant;
  const video = participant.getVideoElement();

  const options = {
    localVideo: video,
    mediaConstraints: constraints,
    onicecandidate: participant.onIceCandidate.bind(participant)
  };
  participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }

      return this.generateOffer(participant.offerToReceiveVideo.bind(participant));
    }
  );

  message.data.forEach(sender => receiveVideo(socket, sender));
}

function onParticipantLeft(message) {
  const participant = participants[message.name];
  participant.dispose();
  delete participants[message.name];
}


const setupSocket = (dispatch, token, meetingId, userId) => {
  const socket = io.connect(API_URL, {
    query: {
      token
    }
  });

  socket.emit('init', meetingId);

  socket.on('peer.connected', (user) => {
    dispatch(addParticipant(user));
    console.log(`${user.email} has joined the conference`);
  });

  socket.on('chat message', (msg) => {
    const { email, text } = msg;
    const timestamp = new Date().getTime();
    dispatch(addChatMessage({ email, text, timestamp }));
  });

  socket.on('peer.disconnected', (user) => {
    dispatch(removeParticipant(user));
    console.log(`${user.email} has left the conference`);
  });

  socket.on('message', (message) => {
    console.info(`received message: ${message.id}`);

    switch (message.id) {
      case 'existingParticipants':
        onExistingParticipants(socket, userId, message);
        break;
      case 'newParticipantArrived':
        onNewParticipant(socket, message);
        break;
      case 'participantLeft':
        onParticipantLeft();
        break;
      case 'receiveVideoAnswer':
        receiveVideoResponse(message);
        break;
      case 'iceCandidate':
        participants[message.name].rtcPeer.addIceCandidate(message.candidate, (error) => {
          if (error) {
            console.error(`Error adding candidate ${error}`);
          }
        });
        break;
      default:
        console.error(`Unrecognized message ${message}`);
    }
  });

  socket.on('error', (err) => {
    console.error(err);
  });

  return socket;
};

export default setupSocket;
