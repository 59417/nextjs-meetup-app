import { Fragment } from "react";
import Head from 'next/head';
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails (props) {
    // console.log(props.meetupData);
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta 
                    name="description" 
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail 
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    )
};

export async function getStaticPaths () {

    const myUser = process.env.MONGODB_USER;
    const myKey = process.env.MONGODB_KEY;
    const myDB = process.env.MONGODB_DATABASE;
    const connectStr = `mongodb+srv://${myUser}:${myKey}@cluster0.enlyh.mongodb.net/${myDB}?retryWrites=true&w=majority`
    // const connectStr = 'mongodb+srv://<user>:<password>>@cluster0.enlyh.mongodb.net/<db>?retryWrites=true&w=majority';
    const client = await MongoClient.connect(connectStr);
    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const meetupIds = await meetupsCollection.find({}, {  
        _id: 1,  // return only Ids
    }).toArray();
    // find({ filter }, { findOption })

    client.close();
    // console.log(meetupIds);

    return {
        // fallback: 'blocking',
        fallback: false,  // if user enter an url not included > return 404
        paths: meetupIds.map(meetup => ({
            params: {
                meetupId: meetup._id.toString()
            }
        }))
        // paths: [
        //     { params: { meetupId: 'm1' }},
        //     { params: { meetupId: 'm2' }}
        // ]
    }
};

export async function getStaticProps (context) {
    // const params =  context.params;
    // console.log(params);  // { meetupId: 'm1' }
    const meetupId = context.params.meetupId;  
    // params.dynamic-file-name === /url
    // console.log(meetupId);  // 624f677a1a76a436fe4e9eed
    
    // connect to MongoDB
    const myUser = process.env.MONGODB_USER;
    const myKey = process.env.MONGODB_KEY;
    const myDB = process.env.MONGODB_DATABASE;
    const connectStr = `mongodb+srv://${myUser}:${myKey}@cluster0.enlyh.mongodb.net/${myDB}?retryWrites=true&w=majority`
    const client = await MongoClient.connect(connectStr);
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    // fetch data from an API
    const selectedMeetup = await meetupsCollection.findOne({
        _id: ObjectId(meetupId)
    });
    // find({ filter }, { findOption })

    client.close();
    // console.log(selectedMeetup);
    
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                image: selectedMeetup.image,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            }
        }
    }
};

export default MeetupDetails;