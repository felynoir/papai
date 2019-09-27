const functions = require('firebase-functions');
const { dialogflow, SimpleResponse,Permission } = require('actions-on-google')

const axios = require('axios')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

const app = dialogflow()

app.intent('Restaurant_near', (conv) => {
    axios.get("")
})

const KEY_API = "AIzaSyBiWtYREWLFOGQJVHsAPYDdm9BW9TZ57C4"

app.intent('Test', function (conv,params, permissionGranted) {

    // คำที่ user พิมพ์มาจะอยู่ใน conv.input.raw 
    // entities ที่ใส่มาจะอยู่ใน conv.parameters
    conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
    conv.ask(new Permission({
        context: 'to locate you',
        permissions: conv.data.requestedPermission,
    }));

    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;
        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
 
            console.log(conv.device)
            conv.ask(new SimpleResponse(`yeh ${conv.device} `))
        }
    } else {
        return conv.close('Sorry, permission denied.');
    }

    //ถ้าใช้ conv.ask บทจะยังไม่ปิดตัวเองหลังตอบ ถ้าอยากให้ปืดตัวเองเปลี่ยนเป็น conv.close

    // SimpleResponse จะเป็นข้อความธรรมดา ถ้าอยากรู้มากกว่านี้ให้ไปเปิด https://developers.google.com/actions/assistant/responses
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)