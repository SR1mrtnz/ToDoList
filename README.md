# To-Do List — Vanilla JavaScript

Progetto del laboratorio **TPSIT · classe quinta · Settimane 5 e 6** (Prof.ssa Paola Bertulli, a.s. 2026/27).
Riferimenti: A. Pollini, *Progettare per Innovare* vol. 3, cap. 9.4 «Progetto 1 — Task Manager e stato» (pp. 290–298) e Laboratorio 9.1 «Task Manager persistente» (p. 319); formula `View = f(State)` dal cap. 3.2.1 (p. 93).

L'app è la stessa che nella **settimana 8** verrà riscritta in React (Laboratorio 10.1) e confrontata riga per riga con questa versione: **conserva il codice originale**.

## Che cosa fa

- aggiungere task da un campo di testo (click sul pulsante **o** Invio)
- completare/riaprire un task cliccando sulla riga
- eliminare un task con il pulsante `×`
- **persistenza**: chiudi il browser, riapri il giorno dopo, ritrovi tutto (localStorage)
- contatore `Totali · Completati · Da fare` sempre coerente, ricavato dallo stato
- frase reattiva: *"Non hai task…"*, *"Fatto tutto…"*, *"Ti restano N task su M"*
- pulsante **Elimina completati** con conferma, visibile solo quando serve
- messaggio di benvenuto persistente (*"Bentornato, Nome"*)
- sfida finale: i task completati vengono mostrati in fondo alla lista

## Come si avvia

```bash
npm install     # solo la prima volta, ricostruisce node_modules
npm run dev     # avvia il server di sviluppo
```

Apri l'indirizzo stampato dal terminale (di norma `http://localhost:5173`) e lascialo aperto: a ogni salvataggio dei file la pagina si ricarica da sola.

Per ripartire da zero durante le prove: console del browser (F12) → `localStorage.clear()` → ricarica.

## Struttura del progetto

```
todo-vanilla/
├── index.html               struttura della pagina (lista vuota: la riempie render())
├── src/
│   ├── main.js              stato, persistenza, view, azioni, eventi
│   └── style.css            stili (base + esercizi 7, 8, 9)
├── esercizi/
│   └── es6-carrello.json    Es 6: stato di un carrello in JSON (esercizio 9.10)
├── SOLUZIONI-ESERCIZI.md    le soluzioni commentate di tutti i 9 esercizi
├── GIT-GUIDA.md             come caricare questo progetto su GitHub, passo passo
└── package.json             nome, script e dipendenze (solo Vite)
```

## Architettura: i tre pilastri

| Pilastro | Che cosa fa | Nel codice |
|----------|-------------|------------|
| **Stato** | I dati, *single source of truth* | `let tasks = caricaStato()` |
| **Logica** (azioni) | Modificano lo stato, non toccano mai la pagina | `addTask()`, `toggleTask()`, `deleteTask()`, `deleteCompletati()` |
| **View** (render) | Funzione "stupida": legge lo stato e disegna | `render()` |

Il flusso di ogni interazione, sempre lo stesso:

```
azione utente → modifica dello stato → salvaStato() → render()
```

Regole rispettate ovunque nel codice:

- manipolazioni **immutabili**: `[...tasks, nuovo]` per aggiungere, `filter` per rimuovere, `map` + spread per modificare (niente `push`)
- i task si identificano per `id` (stabile), mai per posizione nell'array
- nello stato solo ciò che **non si può calcolare**: i conteggi si ricavano al render
- **delega degli eventi**: un listener su `#lista` e uno su `#azioni`, non uno per ogni `<li>`
- `Number(dataset.id)` sui click: gli attributi HTML sono sempre stringhe
- `caricaStato()` robusta: gestione di `null`, JSON non valido (`try…catch`) e forma sbagliata (`Array.isArray`)

## Gli esercizi e dove trovarli

| Es | Esercizio | Dove |
|----|-----------|------|
| 1 | Un quarto task senza toccare l'HTML | soluzione commentata in `SOLUZIONI-ESERCIZI.md` |
| 2 | Conteggio "Da fare" | integrato in `render()` (`src/main.js`) |
| 3 | Prova del disallineamento | soluzione commentata in `SOLUZIONI-ESERCIZI.md` |
| 4 | Un solo punto di salvataggio | integrato: `aggiornaStato()` |
| 5 | Protezione dai dati rotti | integrato: `caricaStato()` con `try…catch` |
| 6 | Carrello e-commerce in JSON | `esercizi/es6-carrello.json` |
| 7 | Benvenuto persistente (es. 9.11) | integrato: `renderBenvenuto()` |
| 8 | Contatore reattivo (es. 9.12) | integrato: `#messaggio` |
| 9 | Elimina completati (Laboratorio 9.1) | integrato: `#azioni` + `deleteCompletati()` |

Ogni pezzo di codice aggiunto dagli esercizi è marcato nel sorgente con un commento `ES n`, così è facile spiegarlo in verifica o all'orale.

## La prova del nove (persistence test)

1. Aggiungi due o tre task tuoi
2. Completane uno
3. **Chiudi del tutto il browser**, non solo la scheda
4. Riaprilo e torna su `localhost:5173`

Devi ritrovare esattamente quello che avevi lasciato, completati compresi.

## Nota per la settimana 8

Non cancellare né sovrascrivere questo progetto: la settimana 8 si apre accanto alla versione React e i due `main.js` vengono confrontati riga per riga. Portalo con te su una chiavetta **senza** `node_modules`, oppure clonalo dal tuo repository GitHub (vedi `GIT-GUIDA.md`).
