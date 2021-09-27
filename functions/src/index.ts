import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const getCitiesWeather = functions.https.onRequest((req,res)=>{
    admin.firestore().doc('North/Cities').get()
    .then(snapshot=>{
        var data = snapshot.data()
        const promise = []
        for(const city in data){
            const p = admin.firestore().doc(`cities-weather/${city}`).get()
            promise.push(p)
        }
        return Promise.all(promise)
    })
    .then(citySnapshot=>{
        const results:any = []
        citySnapshot.forEach(citySnap=>{
            const data = citySnap.data()
            // data.city = citySnap.id
            results.push(data)
        })
        res.send(results)
    })
    .catch(e=>{
        console.log(e)
    })
})

export const updateDelhiWeather = functions.firestore.document('cities-weather/Delhi').onUpdate(change=>{
    const after = change.after.data()
    const payload = {
        data:{
            condition: after.condition,
            temp : String(after.temp)
        }
    }
    return admin.messaging().sendToTopic('cities-weather/Delhi',payload);
})

// export const getDelhiWeather = functions.https.onRequest((request, response) => {
//   admin.firestore().doc('cities-weather/Delhi').get()
//   .then(snapshot=>{
//     const data = snapshot.data()
//     response.send(data)
//   })
//   .catch(e=> {
//       console.log('error: ',e)
//       response.send('error')
//   })
});
