enum AdditionalReducerTypes {
  NEXT_INIT = '@@INIT',

  RESET = 'reset',

  // Mediasoup states
  ADD_MEDIASOUP_VIDEO_CONSUMER = 'add-mediasoup-video-consumer',
  CHANGE_MEDIASOUP_VIDEO_CONSUMER = 'change-mediasoup-video-consumer',
  REMOVE_MEDIASOUP_VIDEO_CONSUMER = 'remove-mediasoup-video-consumer',
  ADD_MEDIASOUP_AUDIO_CONSUMER = 'add-mediasoup-audio-consumer',
  CHANGE_MEDIASOUP_AUDIO_CONSUMER = 'change-mediasoup-audio-consumer',
  REMOVE_MEDIASOUP_AUDIO_CONSUMER = 'remove-mediasoup-audio-consumer',
  // ADD_MEDIASOUP_LOCAL_VIDEO_PRODUCER = 'add-mediasoup-local-video-producer',
  // CHANGE_MEDIASOUP_LOCAL_VIDEO_PRODUCER = 'change-mediasoup-local-video-producer',
  // REMOVE_MEDIASOUP_LOCAL_VIDEO_PRODUCER = 'remove-mediasoup-local-video-producer',
}

export default AdditionalReducerTypes;
