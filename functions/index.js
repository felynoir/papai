const functions = require('firebase-functions');
const { dialogflow, SimpleResponse } = require('actions-on-google')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

const app = dialogflow()

app.intent('Test', function (conv) {

    // คำที่ user พิมพ์มาจะอยู่ใน conv.input.raw 
    // entities ที่ใส่มาจะอยู่ใน conv.parameters
  conv.ask(new SimpleResponse({
    speech: `Here's an example of a simple response. ` +
      `Which type of response would you like to see next?`,
    text: `Here's a simple response. ` +
      `Which response would you like to see next?`,
  }));
    //ถ้าใช้ conv.ask บทจะยังไม่ปิดตัวเองหลังตอบ ถ้าอยากให้ปืดตัวเองเปลี่ยนเป็น conv.close

    // SimpleResponse จะเป็นข้อความธรรมดา ถ้าอยากรู้มากกว่านี้ให้ไปเปิด https://developers.google.com/actions/assistant/responses
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)