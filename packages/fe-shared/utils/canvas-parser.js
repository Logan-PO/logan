const { spawn } = require('child_process');

async function getCanvasData(accessToken, url) {
    let out;
    const canvas = spawn('curl', [
        '-G',
        '-d',
        'access_token=5590~4wucpJFH185XCvMKuhzM0cPcyBpK0e6vjYFNVVzCOil2Nvux7rEdY4AdvJve7GSq',
        'https://canvas.case.edu/api/v1/courses',
    ]);

    canvas.stdout.on('data', data => {
        out = data;
        console.log(`stdout: ${data}`);
    });

    canvas.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    canvas.on('error', error => {
        console.log(`error: ${error.message}`);
    });

    canvas.on('close', code => {
        console.log(`child process exited with code ${code}`);
    });

    return out;
}

/*
exec(
    'curl -G -d "access_token=5590~4wucpJFH185XCvMKuhzM0cPcyBpK0e6vjYFNVVzCOil2Nvux7rEdY4AdvJve7GSq" https://canvas.case.edu/api/v1/courses',
    (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        out = stdout;
    }
);
*/
