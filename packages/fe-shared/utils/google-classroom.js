//GET https://classroom.googleapis.com/v1/courses
//Lists all of the courses from a given user
// Client ID and API key from the Developer Console
//TODO: This is just a class to hold scripts that will be run on a button press from the settings page

import { gapi } from 'gapi-script';
import { getSecret } from '../../aws/src/secret-utils';

var REACT_APP_GOOGLE_CLASS_CLIENT_ID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';
var REACT_APP_GOOGLE_CLASS_API_KEY = 'AIzaSyDFKoctWHEC-3Dz0r3FhB0BfVkPJ14pFjo';
var SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];
//var CLIENT_SECRET = `${getSecret('logan/web-google-creds')} `;
const DISCOVERY_DOCS = ['https://classroom.googleapis.com/$discovery/rest?version=v1'];

//var REDIRECTS = '';
//curl "https://www.googleapis.com/auth/classroom.courses.readonly?access_token=4%2F0AY0e-g66_5W10uNkdIRtDhpGt_eX5JgNmvIN0xYImhlg5UGsmXW1FOdjNZwGb6n99S_QqQ&"

// onClick={() => handleClientLoad()} put in button code on settings page
const handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
};
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
const initClient = () => {
    //setIsLoadingGoogleDriveApi(true);
    gapi.client
        .init({
            apiKey: REACT_APP_GOOGLE_CLASS_API_KEY,
            clientId: REACT_APP_GOOGLE_CLASS_CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        })
        .then(
            function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            function (error) {
                console.log(error);
            }
        );
};
/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
const updateSigninStatus = isSignedIn => {
    if (isSignedIn) {
        // Set the signed in user
        //setSignedInUser(gapi.auth2.getAuthInstance().currentUser.je.Qt);//TODO Don't care about the user info
        //setIsLoadingGoogleDriveApi(false);
        // list files if user is authenticated
        listFiles();
    } else {
        // prompt user to sign in
        handleAuthClick();
    }
};

/**
 * List files.
 */
const listFiles = (searchTerm = null) => {
    //setIsFetchingGoogleDriveFiles(true);
    gapi.client.drive.files
        .list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
            q: searchTerm,
        })
        .then(function (response) {
            // setIsFetchingGoogleDriveFiles(false);
            //  setListDocumentsVisibility(true);
            const res = JSON.parse(response.body);
            //  setDocuments(res.files);
            console.log(res);
        });
};

/**
 *  Sign in the user upon button click.
 */
const handleAuthClick = event => {
    console.log(event);
    gapi.auth2.getAuthInstance().signIn();
};

/**
 *  Sign out the user upon button click.
 */
const handleSignOutClick = event => {
    console.log(event);
    // setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();
};
