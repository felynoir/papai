const functions = require("firebase-functions");
const {
  dialogflow,
  BasicCard,
  Button,
  Image,
  Suggestions,
  LinkOutSuggestion,
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
          const url_map = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
          const radius = 2 * 1000;
          const type = conv.user.storage.typeSearch;
          const rankby = conv.user.storage.rankSearch;
          const query = `location=${latitude},${longitude}&radius=${radius}&type=${type}&rankby=${rankby}&key=${KEY_API}`;
          const res = await axios.get(url_map + query);
          
          const name_type = res.data.results[0];
          const ref = name_type.photos[0].photo_reference;
          const place_id = name_type.place_id;
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${name_type.name
          .split(" ")
          .join("+")}&query_place_id=${place_id}`;
          const urlSuggest = `http://www.google.com/search?q=${name_type.name
          .split(" ")
          .join("+")}&btnI`;
          const urlImg = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${KEY_API}`;
          conv.ask("This is my recommend to you.");
          conv.ask(
            new BasicCard({
              text: name_type.vicinity,
              title: name_type.name,
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
          // conv.ask(new Suggestions(['Suggestion 2', 'Suggestion 3']));
          conv.ask(new LinkOutSuggestion({
            name: 'Suggestion Link',
            url: urlSuggest,
          }));
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
  conv.user.storage.rankSearch = "distance"
  const options = {
    context: "To know your location",
    // Ask for more than one permission. User can authorize all or none.
    permissions: ["DEVICE_PRECISE_LOCATION"]
  };
  return conv.ask(new Permission(options));
});

app.intent("Restaurant_best", conv => {
  conv.user.storage.typeSearch = "restaurant";
  conv.user.storage.rankSearch = "prominence"
  const options = {
    context: "To know your location",
    // Ask for more than one permission. User can authorize all or none.
    permissions: ["DEVICE_PRECISE_LOCATION"]
  };
  return conv.ask(new Permission(options));
});

app.intent("Spa_near", conv => {
  conv.user.storage.typeSearch = "spa";
  conv.user.storage.rankSearch = "distance"
  const options = {
    context: "To know your location",
    // Ask for more than one permission. User can authorize all or none.
    permissions: ["DEVICE_PRECISE_LOCATION"]
  };
  return conv.ask(new Permission(options));
});

app.intent("Spa_best", conv => {
  conv.user.storage.typeSearch = "spa";
  conv.user.storage.rankSearch = "prominence"
  const options = {
    context: "To know your location",
    // Ask for more than one permission. User can authorize all or none.
    permissions: ["DEVICE_PRECISE_LOCATION"]
  };
  return conv.ask(new Permission(options));
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
