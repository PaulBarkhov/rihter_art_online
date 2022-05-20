const formatTime = (time) => {
  return new Date(Math.round(time) * 1000).toISOString().substring(14, 19)
  // return seconds < 10 ? `0${seconds}` : seconds
}

export default formatTime
