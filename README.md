# Wordle

Wordle jokoa HTML, CSS eta JavaScript hutsarekin egina. Hitza asmatu behar duzu, letra eta saiakera kopurua aukeratuta.

## Nola jokatu

1. Aukeratu letra kopurua (4-10) eta saiakera kopurua (1-10), eta sakatu **HASI**.
2. Idatzi hitza pantailako teklatuarekin edo zure teklatuarekin, eta sakatu **ENTER**.
3. Koloreak:
   - **Berdea**: letra zuzena, posizio zuzenean.
   - **Horia**: letra hitzean dago, baina beste posizio batean.
   - **Grisa**: letra ez dago hitzean.

## Nola exekutatu

Ireki `index.html` nabigatzailean. Internet behar da, hitzak API batetik datozelako (lehen eskaerak segundo batzuk behar ditzake).

## Fitxategiak

- `index.html`: pantailak
- `styles.css`: estiloak
- `code.js`: jokoaren logika

## Oharrak

- Azken 10 partidak `localStorage`-n gordetzen dira.
- Hitzak gaztelaniaz dira.