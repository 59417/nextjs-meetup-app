import { Fragment } from "react";
import Head from 'next/head';
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//     {
//         id: 'm1',
//         image: 'https://stage.taipei101mall.com.tw/uploads/content/3539a78f-df62-177c-f388-09243bc44ed2.png',
//         title: 'The First Meetup!',
//         address: 'Taipei, Taiwan',
//         description: 'This is the first meetup.'
//     },
//     {
//         id: 'm2',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Liouho-Night-Market-Kaohsiung.jpg',
//         title: 'The Second Meetup!',
//         address: 'Kaohsiung, Taiwan',
//         description: 'This is the second meetup.'
//     }
// ];


function HomePage (props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta 
                    name="description" 
                    content="Browse a huge list of highly active React Meetups!" 
                />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    )
};

// // not suits this case
// export async function getServerSideProps (context) {
//     // use when need access to incoming request ex.authentication
//     const req = context.req;
//     const res = context.res;
//     // fetch data from an API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     // or when need pre-regenerated multiple times in every sec
//     };
// };

export async function getStaticProps () { // must named getStaticProps
    // fetch data from an API
    const myUser = process.env.MONGODB_USER;
    const myKey = process.env.MONGODB_KEY;
    const myDB = process.env.MONGODB_DATABASE;
    const connectStr = `mongodb+srv://${myUser}:${myKey}@cluster0.enlyh.mongodb.net/${myDB}?retryWrites=true&w=majority`
    // const connectStr = 'mongodb+srv://<user>:<password>@cluster0.enlyh.mongodb.net/<db>?retryWrites=true&w=majority';
    const client = await MongoClient.connect(connectStr);
    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();
    // default find all the documents (= entry in SQL) in that collection

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                id: meetup._id.toString(),
                title: meetup.title,
                image: meetup.image,
                address: meetup.address,
            }))
        },
        revalidate: 10 
        // page regenerated every couple of n(sec) 
        // depends on data change frequency
    }
};

export default HomePage;