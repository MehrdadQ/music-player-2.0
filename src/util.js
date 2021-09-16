import { v4 as uuidv4 } from "uuid";

function lofi() {
  return [
    {
      name: "Calm River",
      artist: "Lesfm",
      cover:
        "https://i.pinimg.com/originals/d6/18/78/d61878a7cfd287a204e645118f7c22fb.jpg",
      id: uuidv4(),
      active: true,
      color: ["rgb(120,218,239)", "rgb(28,138,169)", "rgb(180,218,239)"],
      audio: "https://cdn.pixabay.com/audio/2021/08/11/audio_be8e122dc7.mp3",
    },
    {
      name: "Physical",
      artist: "Mepa ExyZ",
      cover: "https://i1.sndcdn.com/artworks-000641681800-manbde-t500x500.jpg",
      id: uuidv4(),
      active: false,
      color: ["rgb(179,164,194)", "rgb(120, 90, 130)", "rgb(132,161,203)"],
      audio: "https://cdn.pixabay.com/audio/2021/09/06/audio_555a888e1b.mp3",
    },
    {
      name: "Where are we now",
      artist: "beetpro",
      cover:
        "https://assets.pinshape.com/uploads/user/avatar/1218825/cover_1551241507.png",
      id: uuidv4(),
      active: false,
      color: ["rgb(201,149,99)", "rgb(29,19,82)", "rgb(104,182,231)"],
      audio: "https://cdn.pixabay.com/audio/2021/03/07/audio_1d411f3a4c.mp3",
    },
    {
      name: "Cosy",
      artist: "Prigida",
      cover:
        "https://cdn.musicvine.com/images/prigida-avatar-v1_6180582698519834.jpg",
      id: uuidv4(),
      active: false,
      color: ["rgb(85,148,161)", "rgb(30,66,71)", "rgb(175,180,146)"],
      audio:
        "https://cdn.uppbeat.io/audio-output/258/5856/main-version/streaming-previews/STREAMING-cosy-prigida-main-version-02-58-17021.mp3",
    },
    {
      name: "Dream Slow",
      artist: "Wisanga",
      cover:
        "https://cdn.uppbeat.io/images/Wisanga_Avatar_4157365593534235.jpg",
      id: uuidv4(),
      active: false,
      color: ["rgb(143,197,220)", "rgb(1,38,72)", "rgb(212,160,204)"],
      audio:
        "https://cdn.uppbeat.io/audio-output/471/6799/main-version/streaming-previews/STREAMING-dream-slow-wisanga-main-version-02-19-20578.mp3",
    },
    {
      name: "Lucidity",
      artist: "FE77A",
      cover:
        "https://cdn.musicvine.com/images/fe77a-avatar_8827208227206825.jpg",
      id: uuidv4(),
      active: false,
      color: ["rgb(114,134,172)", "rgb(72,64,74)", "rgb(176,166,131)"],
      audio:
        "https://cdn.uppbeat.io/audio-output/432/1113/main-version/streaming-previews/STREAMING-lucidity-fe77a-main-version-02-28-3710.mp3",
    },
    {
      name: "4am",
      artist: "noxz",
      cover:
        "https://cdn.musicvine.com/images/noxz-avatar-v1_5269450939293254.jpg",
      id: uuidv4(),
      active: false,
      color: ["rgb(170,170,176)", "rgb(90,91,95)", "rgb(217,220,167)"],
      audio:
        "https://cdn.uppbeat.io/audio-output/249/1657/main-version/streaming-previews/STREAMING-4am-noxz-main-version-02-20-5868.mp3",
    },
    {
      name: "Snowfall",
      artist: "walz",
      cover:
        "https://cdn.musicvine.com/images/walz-avatar-v2_8353515061791827.jpg",
      id: uuidv4(),
      active: false,
      color: ["rgb(252,211,182)", "rgb(63,52,41)", "rgb(241,238,236)"],
      audio:
        "https://cdn.uppbeat.io/audio-output/240/5935/main-version/streaming-previews/STREAMING-snowfall-walz-main-version-02-12-17217.mp3",
    },
    {
      name: "Selfless",
      artist: "SENSHO",
      cover:
        "https://cdn.musicvine.com/images/Sensho_Avatar_1955111997031914.jpg",
      id: uuidv4(),
      active: false,
      color: ["rgb(243,222,172)", "rgb(70,86,196)", "rgb(163,183,109)"],
      audio:
        "https://cdn.uppbeat.io/audio-output/395/190/main-version/streaming-previews/STREAMING-selfless-sensho-main-version-02-14-883.mp3",
    },
  ];
}

export default lofi;
