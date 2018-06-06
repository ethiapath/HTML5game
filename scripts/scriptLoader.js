const scriptNames = [
    'NetworkWrapper.js',
    'helper.js',
    'classes.js',
    'levels.js',
    'setup.js',
    'gameloop.js'
];


function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); // Make a script DOM node
    script.src = url; // Set it's src to the provided URL
    script.type = 'text/javascript';

    document.body.appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    
}

const scrdir = 'scripts/';
scriptNames.forEach( scr => {
    dynamicallyLoadScript(scrdir + scr)
});