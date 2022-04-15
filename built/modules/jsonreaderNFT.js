"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require('node-fetch');
const url = require('url');
const SEARCH_URL = 'https://ipfs.io/ipfs/QmejaAZpo2KYcEpdcNU2SXEw24NmKu4GXKBc9zdA4Rk651';
const WELCOME_TEXT = 'World Search App';
const INFO_TEXT_HEIGHT = 1.2;
const BUTTON_HEIGHT = 0.6;
const TELEPORTER_BASE = -0.5;
const SAMPLE_QUERY = 'whimwhams'; // Nera's stuff
const WORLD_BUILDERS_LIST_ROTATION = -30;
const TRUNCATE_FIRST_NAME = 15;
class jsonreaderNFT {
    constructor() {
        this.libraryActors = [];
        this.tokenDatabase = {};
        this.maxResults = 25;
    }
    resultMessageFor(query) {
        return `Search results for:\n\n"${query}"`;
    }
    // search for worlds and spawn teleporters
    search(query) {
        // TODO: remove existing teleporters
        for (const actor of this.libraryActors) {
            actor.destroy();
        }
        // query public worlds search api
        let uri = SEARCH_URL; //+ new url.URLSearchParams({ q: query, per: this.maxResults });
        fetch(uri)
            .then((res) => res.json())
            .then((json) => {
            // console.log(json);
            if (json.spaces) {
                for (const world of json['spaces']) {
                    this.tokenDatabase[world.space_id] = {
                        'name': String(world.name),
                        'image': String(world.image_large),
                        'description': String(world.description),
                    };
                }
            }
            else if (json.status == '404') {
                // 404 is a normal HTTP response so you can't 'catch' it
                console.log("ERROR: received a 404 for " + uri);
            }
        });
    }
}
exports.default = jsonreaderNFT;
//# sourceMappingURL=jsonreaderNFT.js.map