//GET https://classroom.googleapis.com/v1/courses
//Lists all of the courses from a given user
// Client ID and API key from the Developer Console

//TODO: This is just a class to hold scripts that will be run on a button press from the settings page
import * as gapi from 'gapi-client';

var CLIENT_ID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDFKoctWHEC-3Dz0r3FhB0BfVkPJ14pFjo';
var SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly';
var CLIENT_SECRET = 'eX2YVDrVoZx1WSN0P4GlpOk9'; //TODO: DO NOT PUSH THIS TO PUBLIC
var REDIRECTS = [];

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
/**
 *  On load, called to load the auth2 library and API client library.
 */
const oauth2Client = new gapi.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECTS[0]);
const URL = oauth2Client.generateAuthUrl({
    scope: SCOPES,
});
const {tokens} = await oauth2Client.getToken();
oauth2Client.setCredentials(tokens);

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
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
                for (i = 0; i < courses.length; i++) {
                    var course = courses[i];
                    appendPre(course.name);
                }
            } else {
                appendPre('No courses found.');
            }
        });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(`${message}\n`);
    pre.appendChild(textContent);
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

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listCourses();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}
