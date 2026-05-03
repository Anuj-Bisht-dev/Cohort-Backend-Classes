const express = require('express');

function block_1_middleware() {
    return new Promise((resolve, reject) => {
        const app = express();

        app.use(express.json()); // app.use a method used for applying builtin middlewares or imported packet middlewares in projects.


        // Built In Middlewares

        // express.json() is a built-in middleware of express based on body.parser.
        // [body.parser] -- it parses the the incoming payload provided by client req and also check it's type 'Content-Text' from header.

        // options in 'express.json()' : ---
        app.use(express.json({ inflate: false })); // it accepts compress req payload when true (default) or vice versa.

        app.use(express.json({ limit: '50kb' })); // sets the max limit of payload size of req.

        app.use(express.json({ strict: false })); // accepts only (obj & arr) when disable
        //  on enable accept anything (str, obj, arr, number, more) json.parse() accepts it.

        // ----------------------------------------------------------------------------

        app.use(express.urlencoded({ extended: true, limit: '100kb' })); // it encodes the spaces or special-char of req payload. 
        // also handles nested obj/rich obj using 'extended: true' by default 'false'. 
        // use extended if needed only.

        // ------------------------------------------------------------------------

        app.use(express.static('root', { dotfiles: 'ignore' })); // static is used for serving file takes 2 prameter static(<rootdir>, <object options>)
        // 'dotfiles' - used to control the files that are started with .<filename> 
        // (ex - .env, .gitignore, .DB_STORE)
        // contains 3 values 'ignore' (default) client cannot able to know that files are exits.
        // 'deny' here client knows that files are exits but not to access if tried req denied because of security.
        // 'allow'  allows client to access dotted file and serves them same as others 
        // (caution: don't use them while productin [sensitive info.])

        // -----

        app.use(express.static('root', { etag: true })); // it prevents server to not send same file again and again.
        //  it creates a checksum/fingerprint for a file.
        //  contain 2 values true(default) and false.

        // example: 
        // a file req of (100Kb) server send complete file
        // browser saves etag in cache.
        // next time client requested for same file the server will sends nothing (0kb).
        // but client still gets the required file from browser cache.

        // -----

        app.use(express.static('root', { extensions: ['.html', '.htm', '.css'] })); // create a fallback instead of returning 404
        // when requested file not found search for same name but with mention extensions file.
        // order matters first metioned extenstion seraches first and serves first.
        // if first one not found then search for second extension.
        // if found in first try or second try it return the file of that tried one.
        // default (false).

        // ----

        app.use(express.static('root', {index: 'home.html'})); // set the default serves file when client first visit a dir.
        // when a client first visit a dir it found the complete dir instead of serving a page.
        // (it is vulnerable to can see complete dir's files)
        // by (default) index.html

        // ------

        app.use(express.static('root', {fallthrough: true})); // it prevents the futher processing when the req is not found and throw an err.
        // true(default) - moves on and passes to next middleware.
        // false - it stops when the req is not found and throw err.

        


        const server = app.listen(0, async () => {
            const port = server.address().port;
            const base = `http://127.1.1:${port}`;

            try {
                // TODO:
            }
            catch (err) {
                console.log(err.message);
            }


            server.close(() => {
                console.log('server has served it\'s purpose. konichiwa!');
                resolve();
            });
        });

    });
}

async function main() {
    await block_1_middleware();

    process.exit(0);
}

main();
