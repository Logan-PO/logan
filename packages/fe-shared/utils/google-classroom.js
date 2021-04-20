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

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

// onClick={() => handleClientLoad()} put in button code on settings page
export function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
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
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
            },
            function (error) {
                appendPre(JSON.stringify(error, null, 2));
            }
        );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listCourses();
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(`${message}\n`);
    pre.appendChild(textContent);
}

/**
 * Print the names of the first 10 courses the user has access to. If
 * no courses are found an appropriate message is printed.
 */
function listCourses() {
    gapi.client.classroom.courses
        .list({
            pageSize: 10,
        })
        .then(function (response) {
            var courses = response.result.courses;
            appendPre('Courses:');

            if (courses.length > 0) {
                for (let i = 0; i < courses.length; i++) {
                    var course = courses[i];
                    appendPre(course.name);
                }
            } else {
                appendPre('No courses found.');
            }
        });
}
