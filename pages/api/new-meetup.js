// /api/new-meetup
// if request send to this url, it will trigger the defined function
// POST /api/new-meetup

import { MongoClient } from 'mongodb';


async function handler (req, res) {
    if (req.method === 'POST') {
        const data = req.body;
        // const { image, title, address, description } = data;
        
        const connectStr = 'mongodb+srv://admin17:71nimda@cluster0.enlyh.mongodb.net/meetups?retryWrites=true&w=majority';
        // need to change: username, password, myfirstdatabase (dbname)
        const client = await MongoClient.connect(connectStr);  // if db doesn't exist it would be created
        const db = client.db();

        const meetupCollection = db.collection('meetups');  // collection equal to tables in SQL
        const result = await meetupCollection.insertOne(data);
        // can insert json (don't need to destruction data)
        console.log(result);

        client.close();

        res.status(201).json({ message: 'Meetup inserted!' });
    } 
};

export default handler;