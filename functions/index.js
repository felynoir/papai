const functions = require("firebase-functions");
const {
  dialogflow,
  BasicCard,
  Button,
  Image,
  Permission
} = require("actions-on-google");

const app = dialogflow();
const axios = require("axios").default;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

const KEY_API = "AIzaSyBiWtYREWLFOGQJVHsAPYDdm9BW9TZ57C4";

app.intent("handle_search_place", (conv, params, confirmationGranted) => {
  return new Promise(async (resolve, reject) => {
    const location = conv.device !== null ? conv.device.location : undefined;
    if (confirmationGranted) {
      if (location) {
        try {
          const { latitude, longitude } = location.coordinates;
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
          const radius = 2 * 1000;
          const type = conv.user.storage.typeSearch;
          const query = `location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${KEY_API}`;
          const res = await axios.get(url + query);

          const restaurant = res.data.results[0];
          const ref = restaurant.photos[0].photo_reference;
          const place_id = restaurant.place_id;
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.name
            .split(" ")
            .join("+")}&query_place_id=${place_id}`;
          const urlImg = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${KEY_API}`;
          conv.ask("This is my recommend to you.");
          conv.ask(
            new BasicCard({
              text: restaurant.vicinity,
              title: restaurant.name,
              buttons: new Button({
                title: "Take me to google map",
                url: mapUrl
              }),
              image: new Image({
                url: urlImg,
                alt: "Image alternate text"
              }),
              display: "CROPPED"
            })
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    }
  });
});

app.intent("Restaurant_near", conv => {
  conv.user.storage.typeSearch = "restaurant";
  const options = {
    context: "To know your location",
    // Ask for more than one permission. User can authorize all or none.
    permissions: ["DEVICE_PRECISE_LOCATION"]
  };
  return conv.ask(new Permission(options));
});

app.intent("Spa_near", conv => {
  conv.user.storage.typeSearch = "spa";
  const options = {
    context: "To know your location",
    // Ask for more than one permission. User can authorize all or none.
    permissions: ["DEVICE_PRECISE_LOCATION"]
  };
  return conv.ask(new Permission(options));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
