/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require */

(function () {
    'use strict';

    var http = require('http');
    var connect = require('connect');

    var host = 'localhost';
    var port = 3000;
    
    var api_host = 'flickholdr.com';
    //var api_path_prefix = '/muse_v1/';
    
    // because JSLint thinks "static" is a reserved word, but connect disagrees.
    connect.theStatic = connect['static'];
    
    var app = connect()
        .use(connect.logger('dev'))
        .use(connect.favicon())
        .use(connect.theStatic('../'))
        .use(function (req, res) {
            var reqid = Math.random();
            if (req.url.indexOf('/proxy/') === 0) {
                var path = "/" + req.url.substr('/proxy/'.length);
                console.log("getting", api_host, path, reqid);
                if (Math.random() > 0.3) {
                    console.log("immediate response", reqid);
                    http.get(
                        {host: api_host, path: path},
                        function (clientResponse) {
                            clientResponse.pipe(res);
                        }
                    );
                } else {
                    console.log("delayed response", reqid);
                    setTimeout(function() {
                        console.log("sending delayed response", reqid);
                        http.get(
                            {host: api_host, path: path},
                            function (clientResponse) {
                                clientResponse.pipe(res);
                            }
                        );
                    }, 5000);
            
                }
            } else {
                res.statusCode = 404;
                res.end("not found");
            }
        })
        .listen(port, host);
    console.log("listening on " + host + " port " + port);
}());
