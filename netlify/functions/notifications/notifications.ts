import { Handler } from '@netlify/functions'
const Parser = require("rss-parser");
let parser = new Parser();
import admin from 'firebase-admin';
var serviceAccount = require("./data.json");
import { getMessaging } from 'firebase-admin/messaging';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quotidie-282b4-default-rtdb.europe-west1.firebasedatabase.app"
});


export const handler: Handler = async (event, context) => {

  let feed = await parser.parseURL("https://rss.aelf.org/evangile");
  let title = ""
  if (feed.items.length == 1 || feed.items.length == 2) {
    title = feed.items[0].title.substring(11);

  } else {
    title = feed.items[3].title.substring(11);
  }

  const notification = {
    title: "Évangile du jour",
    body: title,
    icon: "./quotidieIcon.png",
    click_action: "https://quotidie.fr",
  };



  const to = "c_MSlcF2hO6fa3TOinbde8:APA91bHJpcUxWDrlUI3wm3A0sRTTPPbP60aI5vJ109egAyb6IYXMhNe-LpTmOGTtj8E0_KdcaLqNQZYCwLTjJ7kRyzaisHa5H6WzO6i2BRXk6o_Qa2cLEa-8dDuHNz8uURn_hFZMm0O8"

  var db = admin.database();
  var ref = db.ref("/users");
  ref.once("value", function (snapshot) {
    let users = snapshot.val()
    for (let index = 0; index < Object.values(users).length; index++) {
      const user: any = Object.values(users)[index];
      console.log(user.key)
      sendFCMMessage(user.key, notification).then(res => console.log(res)).catch(err => console.error(err))
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify("Hello there! General Kenoni."),
  }
}

interface Message {
  title: string;
  body: string;
  requireInteraction?: boolean;
  link?: string;
}

async function sendFCMMessage(fcmToken: string, msg: Message) {
  try {
    const res = await getMessaging().send({
      webpush: {
        notification: {
          ...msg,
          icon: './quotidieIcon.png',
          requireInteraction: msg.requireInteraction ?? false,
          actions: [{
            title: 'Open',
            action: 'open',
          }],
          data: {
            link: msg.link,
          },
        },
      },
      token: fcmToken,
    });
  } catch (e) {
    console.error('sendFCMMessage error', e);
  }
}