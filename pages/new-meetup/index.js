import { Fragment } from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";

function NewMeetupPage () {
    
    const router = useRouter();  // navigate

    async function addMeetupHandler (enteredMeetupData) {

        console.log(enteredMeetupData);

        const response = await fetch('/api/new-meetup', {
            method: 'POST',
            body: JSON.stringify(enteredMeetupData),
            // including enteredMeetupData.title, image, address, description 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        router.push('/');  // back to homepage
        
    };

    return (
        <Fragment>
            <Head>
                <title>Add a New Meetup</title>
                <meta 
                    name="description" 
                    content="Add your own meetups and create amazing networking opportunities." 
                />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </Fragment>
    )
};

export default NewMeetupPage;