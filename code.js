"use strict";

const API = "https://words-api-sy2x.onrender.com/api/word";

const konfigurazioa = document.querySelector("#konfigurazioa");
const jokoa = document.querySelector("#jokoa");
const historiala = document.querySelector("#historiala");

const konfigurazioForma = document.querySelector("#konfigurazioForma");
const letraKopurua = document.querySelector("#letraKopurua");
const saiakeraKopurua = document.querySelector("#saiakeraKopurua");

const taula = document.querySelector("#taula");
const teklatua = document.querySelector("#teklatua");

const mezua = document.querySelector("#mezua");
const hasieraMezua = document.querySelector("#hasieraMezua");

const partidaZerrenda = document.querySelector("#partidaZerrenda");
const berrizJokatu = document.querySelector("#berrizJokatu");

const teklatukoLetrak = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ",
    "Z", "X", "C", "V", "B", "N", "M",
    "Á", "É", "Í", "Ó", "Ú", "Ü"
];

let hitza = "";
let hitzarenLuzera = 0;
let saiakeraMaximoak = 0;

let unekoSaiakera = 0;
let unekoLetra = 0;
let unekoHitza = "";

let saiakerak = [];

let jokoaAmaituta = false;


/*
 * Saiakera eta letra jakin bati dagokion laukia itzultzen du.
 *
 * @param {number} saiakera Saiakeraren zenbakia (lerroa).
 * @param {number} letra Letraren zenbakia (zutabea).
 * @returns {Element} Laukiaren elementua.
 */
function lortuLaukia(saiakera, letra) {
    return document.querySelector(`#laukia-${saiakera}-${letra}`);
}


// JOKOA HASI

konfigurazioForma.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        // HTML5 balidazioa (min, max, required)
        if (!konfigurazioForma.checkValidity()) {
            hasieraMezua.textContent = "Sartu balio zuzenak.";
            return;
        }

        hitzarenLuzera = Number(letraKopurua.value);
        saiakeraMaximoak = Number(saiakeraKopurua.value);

        // Pantaila berehala aldatu (API-a itxaron gabe)
        unekoSaiakera = 0;
        unekoLetra = 0;
        unekoHitza = "";
        saiakerak = [];
        hitza = "";
        jokoaAmaituta = false; // kargatzen ari den bitartean idatzi daiteke

        hasieraMezua.textContent = "";
        konfigurazioa.classList.add("ezkutatu");
        jokoa.classList.remove("ezkutatu");

        sortuTaula();
        sortuTeklatua();

        mezua.textContent = "Hitza kargatzen...";

        try {
            const erantzuna = await fetch(
                `${API}?number=1&length=${hitzarenLuzera}&lang=es`
            );

            if (!erantzuna.ok) {
                throw new Error("Errorea API-an");
            }

            const datuak = await erantzuna.json();

            hitza = datuak[0].toUpperCase();

            jokoaAmaituta = false;

            mezua.textContent = "Saiatu hitza asmatzen.";
        }
        catch (error) {
            console.error(error);

            // Errorea: konfigurazio pantailara itzuli
            jokoa.classList.add("ezkutatu");
            konfigurazioa.classList.remove("ezkutatu");

            hasieraMezua.textContent = "Errorea hitza lortzean. Saiatu berriro.";
        }
    }
);


// TAULA SORTU

/*
 * Jokoaren taula sortzen du, saiakera eta letra kopuruaren arabera.
 */
function sortuTaula() {

    taula.textContent = "";

    taula.style.gridTemplateColumns = `repeat(${hitzarenLuzera}, 1fr)`;
    taula.style.maxWidth = `${hitzarenLuzera * 56}px`;

    for (let i = 0; i < saiakeraMaximoak; i++) {

        for (let j = 0; j < hitzarenLuzera; j++) {

            const laukia = document.createElement("div");

            laukia.classList.add("laukia");
            laukia.id = `laukia-${i}-${j}`;

            taula.append(laukia);
        }
    }
}


// TEKLATU BIRTUALA SORTU

/*
 * Teklatu birtualeko botoi bat sortzen du.
 *
 * @param {string} testua Botoiaren testua.
 * @param {Function} ekintza Click egitean exekutatuko den funtzioa.
 */
function sortuBotoia(testua, ekintza) {

    const botoia = document.createElement("button");

    botoia.textContent = testua;
    botoia.classList.add("tekla");
    botoia.addEventListener("click", ekintza);

    teklatua.append(botoia);
}

/*
 * Teklatu birtual osoa sortzen du (letrak, ezabatu eta enter).
 */
function sortuTeklatua() {

    teklatua.textContent = "";

    for (const letra of teklatukoLetrak) {
        sortuBotoia(
            letra,
            () => {
                letraSartu(letra);
            }
        );
    }

    sortuBotoia("⌫", ezabatuLetra);
    sortuBotoia("ENTER", egiaztatuHitza);
}


// LETRA SARTU

/*
 * Letra bat sartzen du uneko saiakerako hurrengo laukian.
 *
 * @param {string} letra Sartu beharreko letra.
 */
function letraSartu(letra) {

    if (jokoaAmaituta || unekoLetra >= hitzarenLuzera) {
        return;
    }

    const laukia = lortuLaukia(unekoSaiakera, unekoLetra);

    laukia.textContent = letra;

    unekoHitza += letra;
    unekoLetra++;
}


// LETRA EZABATU

/*
 * Uneko saiakeraren azken letra ezabatzen du.
 */
function ezabatuLetra() {

    if (jokoaAmaituta || unekoLetra === 0) {
        return;
    }

    unekoLetra--;

    const laukia = lortuLaukia(unekoSaiakera, unekoLetra);

    laukia.textContent = "";

    unekoHitza = unekoHitza.slice(0, -1);
}


// EMAITZAK KALKULATU

/*
 * Uneko saiakeraren letra bakoitzaren emaitza kalkulatzen du.
 *
 * @returns {string[]} Letra bakoitzaren emaitza: "ok", "existe" edo "no".
 */
function kalkulatuEmaitzak() {

    const emaitzak = [];

    const hitzarenLetrak = hitza.split("");
    const saiakerarenLetrak = unekoHitza.split("");

    // Lehenengo: letra zuzenak

    for (let i = 0; i < hitzarenLuzera; i++) {

        if (saiakerarenLetrak[i] === hitzarenLetrak[i]) {
            emaitzak[i] = "ok";
            hitzarenLetrak[i] = null;
        }
    }

    // Bigarrena: hitzean existitzen diren letrak

    for (let i = 0; i < hitzarenLuzera; i++) {

        if (emaitzak[i] === "ok") {
            continue;
        }

        const posizioa = hitzarenLetrak.indexOf(saiakerarenLetrak[i]);

        if (posizioa !== -1) {
            emaitzak[i] = "existe";
            hitzarenLetrak[posizioa] = null;
        }
        else {
            emaitzak[i] = "no";
        }
    }

    return emaitzak;
}


// HITZA EGIAZTATU

/*
 * Uneko saiakera egiaztatzen du, koloreak jartzen ditu eta
 * jokoa amaitu den ala ez erabakitzen du.
 */
function egiaztatuHitza() {

    if (jokoaAmaituta) {
        return;
    }

    // Hitza oraindik kargatu gabe badago, ezin da egiaztatu
    if (hitza === "") {
        mezua.textContent = "Hitza kargatzen...";
        return;
    }

    if (unekoHitza.length !== hitzarenLuzera) {
        mezua.textContent = "Sartu letra guztiak.";
        return;
    }

    const emaitzak = kalkulatuEmaitzak();
    const saiakerarenLetrak = unekoHitza.split("");

    // Taulako koloreak

    for (let i = 0; i < hitzarenLuzera; i++) {
        lortuLaukia(unekoSaiakera, i).classList.add(emaitzak[i]);
    }

    eguneratuTeklatua(saiakerarenLetrak, emaitzak);

    saiakerak.push(unekoHitza);

    // Hitza asmatuta

    if (unekoHitza === hitza) {
        amaituJokoa(true);
        return;
    }

    // Saiakerak amaituta

    unekoSaiakera++;

    if (unekoSaiakera >= saiakeraMaximoak) {
        amaituJokoa(false);
        return;
    }

    unekoLetra = 0;
    unekoHitza = "";

    mezua.textContent = "Beste saiakera bat egin.";
}


// TEKLATUAREN KOLOREAK EGUNERATU

/*
 * Teklatu birtualeko botoien koloreak eguneratzen ditu saiakeraren emaitzaren arabera.
 *
 * @param {string[]} letrak Saiakerako letrak.
 * @param {string[]} emaitzak Letra bakoitzaren emaitza.
 */
function eguneratuTeklatua(letrak, emaitzak) {

    const botoiak = teklatua.querySelectorAll("button");

    for (let i = 0; i < letrak.length; i++) {

        for (const botoia of botoiak) {

            if (botoia.textContent !== letrak[i]) {
                continue;
            }

            if (emaitzak[i] === "ok") {
                botoia.classList.remove("no");
                botoia.classList.remove("existe");
                botoia.classList.add("ok");
            }
            else if (
                emaitzak[i] === "existe" &&
                !botoia.classList.contains("ok")
            ) {
                botoia.classList.remove("no");
                botoia.classList.add("existe");
            }
            else if (
                emaitzak[i] === "no" &&
                !botoia.classList.contains("ok") &&
                !botoia.classList.contains("existe")
            ) {
                botoia.classList.add("no");
            }
        }
    }
}


// TEKLATU ERREALA

document.addEventListener(
    "keydown",
    (e) => {

        if (jokoa.classList.contains("ezkutatu")) {
            return;
        }

        // Teklatu birtualeko botoiak fokua gorde ez dezaten
        document.activeElement.blur();

        const tekla = e.key.toUpperCase();

        if (teklatukoLetrak.includes(tekla)) {
            letraSartu(tekla);
        }
        else if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
            ezabatuLetra();
        }
        else if (e.key === "Enter") {
            e.preventDefault();
            egiaztatuHitza();
        }
    }
);


// JOKOA AMAITU

/*
 * Jokoa amaitzen du, mezua erakutsi, partida gorde eta historiala erakusten du.
 *
 * @param {boolean} irabazi Jokalariak irabazi duen ala ez.
 */
function amaituJokoa(irabazi) {

    jokoaAmaituta = true;

    if (irabazi) {
        mezua.textContent = `Zorionak! Hitza asmatu duzu: ${hitza}`;
    }
    else {
        mezua.textContent = `Saiakerak amaitu dira. Hitza: ${hitza}`;
    }

    gordePartida(irabazi);

    setTimeout(
        () => {
            jokoa.classList.add("ezkutatu");
            historiala.classList.remove("ezkutatu");

            erakutsiHistoriala();
        },
        1500
    );
}


// LOCALSTORAGE

/*
 * localStorage-n gordetako partidak itzultzen ditu.
 *
 * @returns {Object[]} Gordetako partiden zerrenda (hutsik, ez badago ezer).
 */
function lortuPartidak() {
    return JSON.parse(localStorage.getItem("wordlePartidak")) || [];
}

/*
 * Amaitutako partida localStorage-n gordetzen du (azken 10 partidak soilik).
 *
 * @param {boolean} irabazi Jokalariak irabazi duen ala ez.
 */
function gordePartida(irabazi) {

    const partida = {
        hitza,
        saiakerak,
        data: new Date().toLocaleString("eu-ES"),
        emaitza: irabazi ? "irabazi" : "galdu"
    };

    const partidak = lortuPartidak();

    partidak.push(partida);

    if (partidak.length > 10) {
        partidak.shift();
    }

    localStorage.setItem("wordlePartidak", JSON.stringify(partidak));
}


// HISTORIALA ERAKUTSI

/*
 * Gordetako partidak pantailan erakusten ditu, berrienetik zaharrenera.
 */
function erakutsiHistoriala() {

    partidaZerrenda.textContent = "";

    const partidak = lortuPartidak();

    partidak.reverse();

    for (const partida of partidak) {

        const div = document.createElement("div");
        const data = document.createElement("strong");

        data.textContent = partida.data;

        div.classList.add("partida");
        div.append(
            data,
            document.createElement("br"),
            `Hitza: ${partida.hitza}`,
            document.createElement("br"),
            `Emaitza: ${partida.emaitza}`
        );

        partidaZerrenda.append(div);
    }
}


// BERRIZ JOLASTU

berrizJokatu.addEventListener(
    "click",
    () => {
        historiala.classList.add("ezkutatu");
        konfigurazioa.classList.remove("ezkutatu");

        hasieraMezua.textContent = "";
    }
);