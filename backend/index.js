const express = require('express')
const Parser = require("rss-parser");
let parser = new Parser();
const app = express()
const admin = require('firebase-admin');
var serviceAccount = require("./data.json");
const { getMessaging } = require('firebase-admin/messaging');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://quotidie-282b4-default-rtdb.europe-west1.firebasedatabase.app"
});

app.get('/', async (req, res) => {

    let feed = await parser.parseURL("https://rss.aelf.org/evangile");
    let title = "";
    if (feed.items.length == 1 || feed.items.length == 2) {
        title = feed.items[0].title;
    } else {
        title = feed.items[3].title;
    }

    const notification = {
        title: "Évangile du jour",
        body: title,
        icon: "./quotidieIcon.png",
        click_action: "https://quotidie.fr",
    };

    var db = admin.database();
    var ref = db.ref("/users");
    ref.once("value", function (snapshot) {
        let users = snapshot.val()
        for (let index = 0; index < Object.values(users).length; index++) {
            const user = Object.values(users)[index];
            console.log(user.key)
            sendFCMMessage(user.key, notification).then(res => console.log(res)).catch(err => console.error(err))
        }
    });

    res.send(JSON.stringify({ title }))
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Listening to requests on 8080");
});

async function sendFCMMessage(fcmToken, msg) {
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