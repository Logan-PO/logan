//GET https://classroom.googleapis.com/v1/courses
//Lists all of the courses from a given user
// Client ID and API key from the Developer Console
//TODO: This is just a class to hold scripts that will be run on a button press from the settings page

import { gapi } from 'gapi-script';
import { getSecret } from '../../aws/src/secret-utils';
var REACT_APP_GOOGLE_CLASS_CLIENT_ID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';
var REACT_APP_GOOGLE_CLASS_API_KEY = 'AIzaSyDFKoctWHEC-3Dz0r3FhB0BfVkPJ14pFjo';
var SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];
var CLIENT_SECRET = `${getSecret('logan/web-google-creds')} `;
const DISCOVERY_DOCS = ['https://classroom.googleapis.com/$discovery/rest?version=v1'];

var REDIRECTS = '';
//curl "https://www.googleapis.com/auth/classroom.courses.readonly?access_token=4%2F0AY0e-g66_5W10uNkdIRtDhpGt_eX5JgNmvIN0xYImhlg5UGsmXW1FOdjNZwGb6n99S_QqQ&"


// onClick={() => handleClientLoad()} put in button code on settings page
const handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
};
