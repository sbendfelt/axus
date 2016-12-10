const MuteStream = require('mute-stream');
const Stream = require('stream');
const ReadableStream = require('_stream_readable');

function getMutableStream(stream) {
  stream = stream || process.stdout;
  if(stream.mute && stream.unmute) {
    return stream; //incase we are given an already mutable stream.
  }
  const m = new MuteStream({replace: '*'});
  m.pipe(stream /*, {end: false}*/);
  return m;
}

exports.getMutableStream = getMutableStream;
