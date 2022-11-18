// ==UserScript==
// @name         Russian Roulette (modified version of SubSymmetry's country streak counter) v1.0
// @version      1.0
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @description  Russia explodes you.
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL  https://github.com/echandler/Russian-Roulette/raw/main/russianRoulette.user.js
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

let __map = null;

const MAPS_API_URL = "https://maps.googleapis.com/maps/api/js?";

 let scriptObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === "SCRIPT" && node.src.startsWith(MAPS_API_URL)) {
                        // When it’s been added and loaded, load the script below.
                        node.addEventListener("load", getMap); // jshint ignore:line

                        if (scriptObserver) scriptObserver.disconnect();

                        scriptObserver = undefined;
                    }
                }
            }
        });

        scriptObserver.observe(document.head, {
            childList: true,
        });

        scriptObserver.observe(document.body, {
            childList: true,
        });

function getMap(){
    const oldMap = google.maps.Map;
    google.maps.Map = Object.assign(
        function (...args) {
            const res = oldMap.apply(this, args);
            __map = this;
            return res;
        },
        {
            prototype: Object.create(oldMap.prototype),
        }
    );
}

let API_Key = 'ENTER_API_KEY_HERE'; //Replace ENTER_API_KEY_HERE with your API Key (so keep the quote marks)

var $ = window.jQuery
let streak = parseInt(sessionStorage.getItem("Streak"), 10);
let streakBackup = parseInt(sessionStorage.getItem("StreakBackup"), 10);
let checked = parseInt(sessionStorage.getItem("Checked"), 10);
let last_guess = [0,0];
let guess_btn = null;
let check_result = null;

if(sessionStorage.getItem("Streak") == null){
    sessionStorage.setItem("Streak", 0);
    streak = 0;
};

if(sessionStorage.getItem("StreakBackup") == null){
    sessionStorage.setItem("StreakBackup", 0);
    streakBackup = 0;
};

if(sessionStorage.getItem("Checked") == null){
    sessionStorage.setItem("Checked", 0);
    checked = 0;
};

var CountryDict = {
    AF: 'AF',
    AX: 'FI',
    AL: 'AL',
    DZ: 'DZ',
    AS: 'US',
    AD: 'AD',
    AO: 'AO',
    AI: 'GB',
    AQ: 'AQ',
    AG: 'AG',
    AR: 'AR',
    AM: 'AM',
    AW: 'NL',
    AU: 'AU',
    AT: 'AT',
    AZ: 'AZ',
    BS: 'BS',
    BH: 'BH',
    BD: 'BD',
    BB: 'BB',
    BY: 'BY',
    BE: 'BE',
    BZ: 'BZ',
    BJ: 'BJ',
    BM: 'GB',
    BT: 'BT',
    BO: 'BO',
    BQ: 'NL',
    BA: 'BA',
    BW: 'BW',
    BV: 'NO',
    BR: 'BR',
    IO: 'GB',
    BN: 'BN',
    BG: 'BG',
    BF: 'BF',
    BI: 'BI',
    KH: 'KH',
    CM: 'CM',
    CA: 'CA',
    CV: 'CV',
    KY: 'UK',
    CF: 'CF',
    TD: 'TD',
    CL: 'CL',
    CN: 'CN',
    CX: 'AU',
    CC: 'AU',
    CO: 'CO',
    KM: 'KM',
    CG: 'CG',
    CD: 'CD',
    CK: 'NZ',
    CR: 'CR',
    CI: 'CI',
    HR: 'HR',
    CU: 'CU',
    CY: 'CY',
    CZ: 'CZ',
    DK: 'DK',
    DJ: 'DJ',
    DM: 'DM',
    DO: 'DO',
    EC: 'EC',
    EG: 'EG',
    SV: 'SV',
    GQ: 'GQ',
    ER: 'ER',
    EE: 'EE',
    ET: 'ET',
    FK: 'GB',
    FO: 'DK',
    FJ: 'FJ',
    FI: 'FI',
    FR: 'FR',
    GF: 'FR',
    PF: 'FR',
    TF: 'FR',
    GA: 'GA',
    GM: 'GM',
    GE: 'GE',
    DE: 'DE',
    GH: 'GH',
    GI: 'GI',
    GR: 'GR',
    GL: 'DK',
    GD: 'GD',
    GP: 'FR',
    GU: 'US',
    GT: 'GT',
    GG: 'GB',
    GN: 'GN',
    GW: 'GW',
    GY: 'GY',
    HT: 'HT',
    HM: 'AU',
    VA: 'VA',
    HN: 'HN',
    HK: 'CN',
    HU: 'HU',
    IS: 'IS',
    IN: 'IN',
    ID: 'ID',
    IR: 'IR',
    IQ: 'IQ',
    IE: 'IE',
    IM: 'GB',
    IL: 'IL',
    IT: 'IT',
    JM: 'JM',
    JP: 'JP',
    JE: 'GB',
    JO: 'JO',
    KZ: 'KZ',
    KE: 'KE',
    KI: 'KI',
    KR: 'KR',
    KW: 'KW',
    KG: 'KG',
    LA: 'LA',
    LV: 'LV',
    LB: 'LB',
    LS: 'LS',
    LR: 'LR',
    LY: 'LY',
    LI: 'LI',
    LT: 'LT',
    LU: 'LU',
    MO: 'CN',
    MK: 'MK',
    MG: 'MG',
    MW: 'MW',
    MY: 'MY',
    MV: 'MV',
    ML: 'ML',
    MT: 'MT',
    MH: 'MH',
    MQ: 'FR',
    MR: 'MR',
    MU: 'MU',
    YT: 'FR',
    MX: 'MX',
    FM: 'FM',
    MD: 'MD',
    MC: 'MC',
    MN: 'MN',
    ME: 'ME',
    MS: 'GB',
    MA: 'MA',
    MZ: 'MZ',
    MM: 'MM',
    NA: 'NA',
    NR: 'NR',
    NP: 'NP',
    NL: 'NL',
    AN: 'NL',
    NC: 'FR',
    NZ: 'NZ',
    NI: 'NI',
    NE: 'NE',
    NG: 'NG',
    NU: 'NZ',
    NF: 'AU',
    MP: 'US',
    NO: 'NO',
    OM: 'OM',
    PK: 'PK',
    PW: 'PA',
    PS: 'IL',
    PA: 'PA',
    PG: 'PG',
    PY: 'PY',
    PE: 'PE',
    PH: 'PH',
    PN: 'GB',
    PL: 'PL',
    PT: 'PT',
    PR: 'US',
    QA: 'QA',
    RE: 'FR',
    RO: 'RO',
    RU: 'RU',
    RW: 'RW',
    BL: 'FR',
    SH: 'GB',
    KN: 'KN',
    LC: 'LC',
    MF: 'FR',
    PM: 'FR',
    VC: 'VC',
    WS: 'WS',
    SM: 'SM',
    ST: 'ST',
    SA: 'SA',
    SN: 'SN',
    RS: 'RS',
    SC: 'SC',
    SL: 'SL',
    SG: 'SG',
    SK: 'SK',
    SI: 'SI',
    SB: 'SB',
    SO: 'SO',
    ZA: 'ZA',
    GS: 'GB',
    ES: 'ES',
    LK: 'LK',
    SD: 'SD',
    SR: 'SR',
    SJ: 'NO',
    SZ: 'SZ',
    SE: 'SE',
    CH: 'CH',
    SY: 'SY',
    TW: 'TW',
    TJ: 'TJ',
    TZ: 'TZ',
    TH: 'TH',
    TL: 'TL',
    TG: 'TG',
    TK: 'NZ',
    TO: 'TO',
    TT: 'TT',
    TN: 'TN',
    TR: 'TR',
    TM: 'TM',
    TC: 'GB',
    TV: 'TV',
    UG: 'UG',
    UA: 'UA',
    AE: 'AE',
    GB: 'GB',
    US: 'US',
    UM: 'US',
    UY: 'UY',
    UZ: 'UZ',
    VU: 'VU',
    VE: 'VE',
    VN: 'VN',
    VG: 'GB',
    VI: 'US',
    WF: 'FR',
    EH: 'MA',
    YE: 'YE',
    ZM: 'ZM',
    ZW: 'ZW',
    SX: 'NL',
    CW: 'NL'
};

function updateStreak(newVariable){
    streak = newVariable;
    if(document.getElementById("country-streak") != null){
        document.getElementById("country-streak").innerHTML = `<div id="country-streak"><div class="status_value__xZMNY">${streak}</div></div>`;
    };
    if(document.getElementById("country-streak2") != null && document.querySelectorAll('div[data-qa]')[8] != null && !document.querySelector('.standard-final-result_section___B3ne')){
        document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: ${streak}</i></h2>`;
    };
    if(document.getElementById("country-streak2") != null && !!document.querySelector('.standard-final-result_section___B3ne')){
        document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: ${streak}</i></h2>`;
    };
};

function addCounter(newDiv0){
    if(document.getElementsByClassName("status_section__8uP8o").length == 3 && location.pathname.startsWith("/game/")){
        newDiv0 = document.createElement("div")
        newDiv0.className = 'status_section__8uP8o';
        document.getElementsByClassName("status_inner__1eytg")[0].appendChild(newDiv0);
        newDiv0.innerHTML = `<div class="status_label__SNHKT">Streak</div><div id="country-streak"><div class="status_value__xZMNY">${streak}</div></div>`;
     };
    if(document.getElementsByClassName("status_section__8uP8o").length == 4 && document.getElementsByClassName("status_label__SNHKT")[3].innerText == "TIME LEFT" && location.pathname.startsWith("/game/")){
        newDiv0 = document.createElement("div")
        newDiv0.className = 'status_section__8uP8o';
        document.getElementsByClassName("status_inner__1eytg")[0].appendChild(newDiv0);
        newDiv0.innerHTML = `<div class="status_label__SNHKT">Streak</div><div id="country-streak"><div class="status_value__xZMNY">${streak}</div></div>`;
    };
};

function addCounterOnRefresh(){
    setTimeout(function(){
        addCounter();
    },50);
    setTimeout(function(){
        addCounter();
    },300);
};

function addCounter2(){
    addCounter();
    if(document.getElementsByClassName("status_section__8uP8o").length == 0){
        setTimeout(function(){
            addCounter();
            if(document.getElementsByClassName("status_section__8uP8o").length == 0){
                setTimeout(function(){
                    addCounter();
                    if(document.getElementsByClassName("status_section__8uP8o").length == 0){
                        setTimeout(function(){
                            addCounter();
                            if(document.getElementsByClassName("status_section__8uP8o").length == 0){
                                setTimeout(function(){
                                    addCounter();
                                    if(document.getElementsByClassName("status_section__8uP8o").length == 0){
                                        setTimeout(function(){
                                            addCounter();
                                        }, 4000);
                                    };
                                }, 3000);
                            };
                        }, 2000);
                    };
                }, 1200);
            };
        }, 400);
    };
};

async function getUserAsync1(location){
    if(location[0] <= -85.05){
        return 'AQ';
    }
    else{
    let api = "https://api.bigdatacloud.net/data/reverse-geocode?latitude="+location[0]+"&longitude="+location[1]+"&localityLanguage=en&key="+API_Key
    let response = await fetch(api)
        .then(res => res.json())
        .then((out) => {
            return CountryDict[out.countryCode]
        })
    return response;
    };
};

async function getUserAsync(xy) {
    if(location[0] <= -85.05){
        return 'AQ';
    }
            let url = `https://nominatim.openstreetmap.org/reverse.php?format=json&zoom=5&
                           lat=${xy[0]}&
                           lon=${xy[1]}`;

            return fetch(url).then(res => res.json())
                .then(json => {
                     return CountryDict[json.address.country_code.toUpperCase()];
                })
                .catch((error) => {
                console.error(error);
            });
}

function check(){
    const game_tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    const api_url = "https://www.geoguessr.com/api/v3/games/"+game_tag
    let rounds_tab = document.getElementsByClassName("status_value__xZMNY")
    let current_round = rounds_tab[1].innerHTML.substr(0, rounds_tab[1].innerHTML.indexOf('/')).trim();
    fetch(api_url)
    .then(res => res.json())
    .then((out) => {
        rounds_tab = document.getElementsByClassName("status_value__xZMNY")
        current_round = rounds_tab[1].innerHTML.substr(0, rounds_tab[1].innerHTML.indexOf('/')).trim();
        let guess_counter = out.player.guesses.length
        let guess = [out.player.guesses[guess_counter-1].lat,out.player.guesses[guess_counter-1].lng]
        if (guess[0] == last_guess[0] && guess[1] == last_guess[1]){
            return;
        };
        last_guess = guess
        let location = [out.rounds[guess_counter-1].lat,out.rounds[guess_counter-1].lng]
        getUserAsync(guess)
        .then(gue => {
            getUserAsync(location)
            .then(loc => {
                if (gue == loc){
                    updateStreak(streak + 1);
                    sessionStorage.setItem("Streak", streak);
                    streakBackup = streak;
                    sessionStorage.setItem("StreakBackup", streak);
                }
                else {

                    bombit(location[1], location[0]);

                    if(streak == 0){
                        streakBackup = 0;
                        sessionStorage.setItem("StreakBackup", 0);
                    };
                    if(streak == 1){
                        updateStreak(0);
                        sessionStorage.setItem("Streak", 0);
                        document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: ${streak}</i></h2>Your streak ended after correctly guessing <div class="guess-description-distance_distanceLabel__23Opn"><div class="styles_root__eoNIJ styles_variantWhiteTransparent__20ADs styles_roundnessSmall__ZbRvs"><div class="styles_start__u_cL2 styles_right__hZg0u"></div><div class="guess-description-distance_distanceValue__BRuXF">${streakBackup}</div><div class="styles_end__euu3r styles_right__hZg0u"></div></div></div> country.`;
                    };
                    if(streak > 1){
                        updateStreak(0);
                        sessionStorage.setItem("Streak", 0);
                        document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: ${streak}</i></h2>Your streak ended after correctly guessing <div class="guess-description-distance_distanceLabel__23Opn"><div class="styles_root__eoNIJ styles_variantWhiteTransparent__20ADs styles_roundnessSmall__ZbRvs"><div class="styles_start__u_cL2 styles_right__hZg0u"></div><div class="guess-description-distance_distanceValue__BRuXF">${streakBackup}</div><div class="styles_end__euu3r styles_right__hZg0u"></div></div></div> countries in a row.`;
                    };
                };
            });
        });
    })
.catch(err => { throw err });

};

function runCheck(){
    if (!!document.querySelector('.result-layout_root__NfX12') && location.pathname.startsWith("/game/") && sessionStorage.getItem("Checked") == 0){
        check();
        checked = checked + 1;
        sessionStorage.setItem("Checked", checked);
    }
    else if (!document.querySelector('.result-layout_root__NfX12') && location.pathname.startsWith("/game/") && sessionStorage.getItem("Checked") != 0){
        checked = 0;
        sessionStorage.setItem("Checked", checked)
    };
};

function addStreakRoundResult(newDiv1){
    if(document.getElementById("country-streak2") == null && document.querySelectorAll('div[data-qa]')[8] != null && !document.querySelector('.standard-final-result_section___B3ne') && location.pathname.startsWith("/game/")){
        newDiv1 = document.createElement("div")
        document.querySelectorAll('div[data-qa]')[8].appendChild(newDiv1);
        newDiv1.innerHTML = `<div id="country-streak2" style="text-align:center"><br><h2><i>Country Streak: ${streak}</i></h2></div>`;
    };
};

function addStreakGameSummary(newDiv2){
    if(document.getElementById("country-streak2") == null && !!document.querySelector('.standard-final-result_section___B3ne') && location.pathname.startsWith("/game/")){
        newDiv2 = document.createElement("div")
        document.getElementsByClassName("progress-bar_background__A6ZDS progress-bar_expandHeight__W_59W")[0].appendChild(newDiv2);
        newDiv2.innerHTML = `<div id="country-streak2" style="text-align:center"><br><h2><i>Country Streak: ${streak}</i></h2></div>`;
    };
};

function addStreak(){
    runCheck();
    setTimeout(function(){
        runCheck();
    }, 250);
    setTimeout(function(){
        runCheck();
    }, 500);
    setTimeout(function(){
        runCheck();
    }, 1200);
    setTimeout(function(){
        runCheck();
    }, 2000);
    setTimeout(function(){
        addStreakRoundResult();
    },300);
    setTimeout(function(){
        addStreakRoundResult();
    },500);
    setTimeout(function(){
        addStreakGameSummary();
    },200);
    setTimeout(function(){
        addStreakGameSummary();
    },400);
    setTimeout(function(){
        addStreakRoundResult();
        addStreakGameSummary();
    },1200);
    setTimeout(function(){
        addStreakRoundResult();
        addStreakGameSummary();
    },2000);
};

document.addEventListener('keypress', (e) => {
    switch (e.key){
        case '1':
            updateStreak(streak + 1);
            sessionStorage.setItem("Streak", streak);
            streakBackup = streak;
            sessionStorage.setItem("StreakBackup", streak);
            break;
        case '2':
            updateStreak(streak - 1);
            sessionStorage.setItem("Streak", streak);
            streakBackup = streak;
            sessionStorage.setItem("StreakBackup", streak);
            break;
        case '8':
            updateStreak(streakBackup + 1);
            sessionStorage.setItem("Streak", streak);
            streakBackup = streak;
            sessionStorage.setItem("StreakBackup", streak);
            break;
        case '0':
            updateStreak(0);
            sessionStorage.setItem("Streak", 0);
            streakBackup = 0;
            sessionStorage.setItem("StreakBackup", 0);
            break;
    };
});

document.addEventListener('click', addCounter2, false);
document.addEventListener('click', addStreak, false);
document.addEventListener('load', addCounterOnRefresh(), false);

function bombit(x,y){
    // https://stackoverflow.com/questions/16800865/animate-google-maps-polyline

    let moscow = {y: 55.741875, x: 37.624404};

    let departure = new google.maps.LatLng(moscow.y, moscow.x); //Set to whatever lat/lng you need for your departure location
    let arrival = new google.maps.LatLng(y, x); //Set to whatever lat/lng you need for your arrival location
    let line = new google.maps.Polyline({
        path: [departure, departure],
        strokeColor: "rgba(255, 0, 0, 0.3)",
        strokeOpacity: 1,
        strokeWeight: 1,
        geodesic: true, //set to false if you want straight line instead of arc
        map: __map,
    });
    let step = 0;
    let numSteps = 250; //Change this to set animation resolution
    let timePerStep = 5; //Change this to alter animation speed

    let audo = new Audio('https://www.soundjay.com/mechanical/bomb-falling-and-exploding-02.wav');
    audo.volume= 0.1;
    audo.play();

    let interval = setInterval(function() {
        step += 1;
        if (step > numSteps) {
            clearInterval(interval);
            makeCrater(arrival.lng(), arrival.lat());
            bringUpTail();
        } else {
            let are_we_there_yet = google.maps.geometry.spherical.interpolate(departure,arrival,step/numSteps);
            line.setPath([departure, are_we_there_yet]);
        }
    }, timePerStep);

    function bringUpTail(){
        let interval = setInterval(function() {
            step -= 1;
            if (step < 0) {
                clearInterval(interval);
                line.setMap(null);
            } else {
                let are_we_there_yet = google.maps.geometry.spherical.interpolate(arrival,departure,step/numSteps);
                line.setPath([arrival, are_we_there_yet]);
            }
        }, timePerStep)
    }

    function makeCrater(x,y){
        let bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(y - 0.9, x - 1.3),
            new google.maps.LatLng(y + 0.9, x + 1.3)
        );

        const image = "https://i.imgur.com/wMqEYzG.png";

        class Crater extends google.maps.OverlayView {
            bounds;
            image;
            div;
            constructor(bounds, image) {
                super();
                this.bounds = bounds;
                this.image = image;
            }
            /**
             * onAdd is called when the map's panes are ready and the overlay has been
             * added to the map.
             */
            onAdd() {
                this.div = document.createElement("div");
                this.div.style.borderStyle = "none";
                this.div.style.borderWidth = "0px";
                this.div.style.position = "absolute";

                // Create the img element and attach it to the div.
                const img = document.createElement("img");

                img.src = this.image;
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.position = "absolute";
                this.div.appendChild(img);

                // Add the element to the "overlayLayer" pane.
                const panes = this.getPanes();

                panes.overlayLayer.appendChild(this.div);
            }
            draw() {
                // We use the south-west and north-east
                // coordinates of the overlay to peg it to the correct position and size.
                // To do this, we need to retrieve the projection from the overlay.
                const overlayProjection = this.getProjection();
                // Retrieve the south-west and north-east coordinates of this overlay
                // in LatLngs and convert them to pixel coordinates.
                // We'll use these coordinates to resize the div.
                const sw = overlayProjection.fromLatLngToDivPixel(
                    this.bounds.getSouthWest()
                );
                const ne = overlayProjection.fromLatLngToDivPixel(
                    this.bounds.getNorthEast()
                );

                // Resize the image's div to fit the indicated dimensions.
                if (this.div) {
                    this.div.style.left = sw.x + "px";
                    this.div.style.top = ne.y + "px";
                    this.div.style.width = ne.x - sw.x + "px";
                    this.div.style.height = sw.y - ne.y + "px";
                }
            }
            /**
             * The onRemove() method will be called automatically from the API if
             * we ever set the overlay's map property to 'null'.
             */
            onRemove() {
                if (this.div) {
                    this.div.parentNode.removeChild(this.div);
                    delete this.div;
                }
            }
            /**
             *  Set the visibility to 'hidden' or 'visible'.
             */
            hide() {
                if (this.div) {
                    this.div.style.visibility = "hidden";
                }
            }
            show() {
                if (this.div) {
                    this.div.style.visibility = "visible";
                }
            }
            toggle() {
                if (this.div) {
                    if (this.div.style.visibility === "hidden") {
                        this.show();
                    } else {
                        this.hide();
                    }
                }
            }
            toggleDOM(map) {
                if (this.getMap()) {
                    this.setMap(null);
                } else {
                    this.setMap(map);
                }
            }
        }

        const overlay = new Crater(bounds, image);

        overlay.setMap(__map);
    }
}
