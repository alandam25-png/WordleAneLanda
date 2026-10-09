# Wordle

Jokoa HTML, CSS eta JavaScript erabiliz egin dut. Hitz bat asmatu behar da, aukeratutako letra eta saiakera kopuruaren barruan.

## Nola jokatu

1. Aukeratu hitzaren letra kopurua (4-10) eta saiakera kopurua (1-10). Ondoren, sakatu **HASI**.
2. Idatzi hitz bat teklatuarekin eta sakatu **ENTER**.
3. Koloreek esaten dute ea asmatu duzun:

   * **Berdea:** letra eta posizioa zuzenak dira.
   * **Horia:** letra hitzean dago, baina beste posizio batean.
   * **Grisa:** letra ez dago hitzean.

## Nola ireki

Ireki `index.html` fitxategia nabigatzailean. Hitzak API batetik hartzen direnez, Internet behar da. Batzuetan, lehenengoan pixka bat itxaron behar da.

## Fitxategiak

* `index.html`: jokoaren pantaila.
* `styles.css`: diseinua.
* `code.js`: jokoaren kodea.

## Oharrak

* Azken 10 partidak `localStorage`-n gordetzen dira.
* Hitzak gaztelaniaz daude.
