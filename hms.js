const jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");
const axios = require("axios").default;
const { database } = require("./firebase");
const { generateNewMeetId } = require("./utils");
const APP_ACCESS_KEY = process.env.HMS_APP_ACCESS_KEY;
const APP_SECRET = process.env.HMS_APP_SECRET;

const createNewRoom = async (user) => {
  return axios
    .post(
      "https://prod-in2.100ms.live/api/v2/rooms",
      {
        name: "xfv-rgad-vsq",
        description: JSON.stringify({ host: user.uid }),
      },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + getManagementToken(),
        },
      }
    )
    .then((result) => {
      database.ref("Meetings").child(result.data.name).set({
        host: user.uid,
        meetId: result.data.name,
      });
      return getRoomToken(result, user);
    });
};
const joinRoom = async (user, meetId) => {
  return axios
    .post(
      "https://prod-in2.100ms.live/api/v2/rooms",
      {
        name: meetId,
      },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + getManagementToken(),
        },
      }
    )
    .then((result) => getRoomToken(result, user));
};

const getRoomToken = (result, user) => {
  const { host } = JSON.parse(result.data.description || "{}");
  return {
    meetId: result.data.name,
    token: getAppToken(result.data, user.uid === host),
  };
};

const getManagementToken = () => {
  return jwt.sign(
    {
      access_key: APP_ACCESS_KEY,
      type: "management",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    },
    APP_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "24h",
      jwtid: uuid4(),
    }
  );
};

const getAppToken = (room, isHost = false) => {
  const payload = {
    access_key: APP_ACCESS_KEY,
    room_id: room.id,
    user_id: room.user,
    role: isHost ? "host" : "guest",
    type: "app",
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, APP_SECRET, {
    algorithm: "HS256",
    expiresIn: "24h",
    jwtid: uuid4(),
  });
};

exports.createNewRoom = createNewRoom;
exports.joinRoom = joinRoom;
