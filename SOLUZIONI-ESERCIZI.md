# Soluzioni degli esercizi — To-Do List (Settimane 5 e 6)

Documento di studio: le soluzioni di tutti i **9 esercizi** del tutorial, con la spiegazione del perché.
Gli esercizi **2, 4, 5, 7, 8, 9** sono già integrati nell'app (`src/main.js`, marcati da commenti `ES n`).
Gli esercizi **1 e 3** sono prove a se stanti della settimana 5: qui trovi come farli e che cosa dimostrano.

---

## ES 1 — Un quarto task, senza toccare l'HTML *(base)*

**Testo.** Aggiungi un quarto task alla lista che compare a schermo, senza scrivere niente in `index.html`.

**Soluzione.** La lista a schermo è generata da `render()` a partire dall'array: se vuoi una voce in più a schermo, la voce in più deve stare **nell'array** (lo stato).

```js
// in src/main.js, dentro l'array tasks (nella versione "parte 1" dello stato):
let tasks = [
  { id: 1, title: "Studiare per la verifica", completed: false },
  { id: 2, title: "Comprare il pane", completed: true },
  { id: 3, title: "Finire il progetto TPSIT", completed: false },
  { id: 4, title: "Portare fuori il cane", completed: false }   // nuovo
]
```

Salvi, e il contatore passa da solo a `Totali: 4`. Non hai toccato né l'HTML né il contatore: hai cambiato lo stato e la view lo ha seguito.

**Attenzione:** `completed` è un booleano, non la stringa `"false"`.

> Nota: nell'app finale lo stato iniziale non è scritto a mano ma caricato dal localStorage con `caricaStato()` — alla prima visita la lista parte vuota e i task li aggiungi tu dall'interfaccia. Il concetto dell'esercizio resta identico: **ciò che compare a schermo viene sempre dallo stato**.

---

## ES 2 — Aggiungi il conteggio dei task da fare *(base)* — *integrato nell'app*

**Testo.** Modifica `render()` perché la riga di informazioni mostri anche quanti task restano da fare: `Totali: 4 · Completati: 1 · Da fare: 3`. Vincolo: il numero "da fare" non deve essere memorizzato da nessuna parte.

**Soluzione** (in `render()`, `src/main.js`):

```js
const completati = tasks.filter(t => t.completed).length
const daFare = tasks.filter(t => !t.completed).length

info.textContent =
  `Totali: ${tasks.length} · Completati: ${completati} · Da fare: ${daFare}`
```

Versione equivalente con la sottrazione: `const daFare = tasks.length - completati`.

**Perché.** Il valore si **ricava** dallo stato al momento del render, non si memorizza: se fosse un campo dello stato, prima o poi divergerebbe dalla realtà. È la regola della sezione 02: *nello stato ci va solo ciò che non si può calcolare dal resto*.

---

## ES 3 — Prova il disallineamento sulla tua app *(intermedio)*

**Testo.** Dopo la chiamata a `render()`, in fondo a `main.js`, aggiungi tre righe che inseriscono un `<li>` direttamente nella pagina, senza passare dallo stato. Osserva. Poi rimuovile.

**Soluzione** (da mettere e togliere, non è codice da tenere):

```js
// in fondo a src/main.js, DOPO render()
render()

const intruso = document.createElement("li")
intruso.textContent = "Task fantasma"
lista.appendChild(intruso)
```

**Che cosa dimostra.** La lista mostra quattro voci, ma il contatore continua a dire `Totali: 3`: il task fantasma non esiste nello stato, quindi per il contatore non esiste. C'è di peggio: al primo click su un task qualunque parte `render()`, l'HTML viene rigenerato dallo stato e il task fantasma **sparisce**. Tutto ciò che non sta nello stato viene cancellato al primo render — è il motivo per cui la view non si tocca mai a mano.

---

## ES 4 — Una sola riga di salvataggio invece di tre *(intermedio)* — *integrato nell'app*

**Testo.** Tre chiamate a `salvaStato()` significano tre punti in cui puoi dimenticartela. Riorganizza il codice perché il salvataggio avvenga in un solo posto, senza cambiare comportamento.

**Soluzione** (in `src/main.js`):

```js
function aggiornaStato(nuoviTasks) {
  tasks = nuoviTasks
  salvaStato()
  render()
}

function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return
  aggiornaStato([...tasks, { id: Date.now(), title: pulito, completed: false }])
}

function toggleTask(id) {
  aggiornaStato(
    tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  )
}

function deleteTask(id) {
  aggiornaStato(tasks.filter(t => t.id !== id))
}
```

**Perché.** Tutte e tre le azioni facevano la stessa coppia `salvaStato()` + `render()`, sempre nello stesso ordine: se due cose accadono sempre insieme, possono diventare una cosa sola. Le azioni ora fanno una cosa sola — calcolare il nuovo array — e chi salva e chi ridisegna non le riguarda più.

**Attenzione a NON chiamare il salvataggio dentro `render()`**: la view deve restare "stupida", e il render viene chiamato anche all'avvio, quando non c'è niente di nuovo da salvare.

Questa funzione è il parente povero di `setTasks` in React: riceve il nuovo stato, lo memorizza e fa ridisegnare.

---

## ES 5 — Proteggersi dai dati rotti *(avanzato)* — *integrato nell'app*

**Testo.** Da console: `localStorage.setItem("todo-tasks", "non sono json")`, poi ricarica. L'app muore con un `SyntaxError`: la lista e il contatore non compaiono più e *Aggiungi* non funziona. Rendi `caricaStato()` resistente.

**Soluzione** (in `src/main.js`):

```js
function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return []

  try {
    const dati = JSON.parse(testo)
    // difesa in più: deve essere proprio un array
    return Array.isArray(dati) ? dati : []
  } catch (errore) {
    console.error("Dati salvati non validi, riparto da zero:", errore.message)
    return []
  }
}
```

**Perché.** Quando la stringa non è JSON valido, `JSON.parse()` **solleva un'eccezione**: un errore che interrompe lo script, così il resto di `main.js` non viene più eseguito. Un'eccezione si intercetta con `try…catch` (libro, pp. 285–286: mai lasciare un `catch` vuoto — deve almeno registrare l'errore). Il controllo `Array.isArray` copre anche un JSON valido ma della forma sbagliata: `"42"` è JSON legale, ma `42.map(...)` non esiste.

---

## ES 6 — Esercizio 9.10: lo stato di un carrello in JSON *(carta e penna)*

**Testo.** Progetta in JSON lo stato di un carrello di e-commerce: più prodotti diversi, quantità multiple dello stesso prodotto, un eventuale codice sconto. Regola: nello stato ci va solo ciò che non si può calcolare.

**Soluzione** — file pronto in `esercizi/es6-carrello.json`:

```json
{
  "articoli": [
    { "id": 101, "nome": "Cuffie BT",  "prezzo": 39.90, "quantita": 2 },
    { "id": 204, "nome": "Mouse",      "prezzo": 15.50, "quantita": 1 }
  ],
  "codiceSconto": "SCUOLA10",
  "spedizione": 4.90
}
```

**Che cosa NON c'è, e perché:**

- `totale` — si calcola: `articoli.reduce((s, a) => s + a.prezzo * a.quantita, 0)`
- `numeroArticoli` — si calcola con un altro `reduce` sulle quantità
- `importoSconto` — si calcola dal totale e dal codice
- `carrelloVuoto` — è `articoli.length === 0`

Il **codice sconto** invece va memorizzato: lo ha digitato l'utente, non è ricavabile. E la **quantità** è un campo della riga del carrello, non del prodotto: due unità dello stesso articolo sono una riga con `quantita: 2`, non due righe uguali. Ogni campo calcolabile che memorizzi è un campo che un giorno dirà una cosa diversa dagli altri.

---

## ES 7 — Esercizio 9.11: messaggio di benvenuto persistente *(base)* — *integrato nell'app*

**Testo.** Alla prima apertura l'app chiede il nome e lo salva; dalle visite successive mostra `Bentornato, Sara` senza chiedere più niente.

**Soluzione.** In `index.html`, sopra il form dei task: `<div id="benvenuto"></div>`. In `src/main.js`:

```js
const CHIAVE_NOME = "todo-nome"
const box = document.querySelector("#benvenuto")

function renderBenvenuto() {
  const nome = localStorage.getItem(CHIAVE_NOME)

  if (nome) {
    box.innerHTML = `<p>Bentornato, ${nome}</p>`
    return
  }

  box.innerHTML = `
    <input type="text" id="campo-nome" placeholder="Come ti chiami?">
    <button id="salva-nome">Salva</button>
  `

  document.querySelector("#salva-nome").addEventListener("click", () => {
    const valore = document.querySelector("#campo-nome").value.trim()
    if (valore === "") return
    localStorage.setItem(CHIAVE_NOME, valore)
    renderBenvenuto()          // ridisegna: ora mostra il saluto
  })
}

renderBenvenuto()
```

**Perché.** Il nome è una stringa, quindi va in localStorage così com'è, **senza** `JSON.stringify`, con una chiave diversa da quella dei task. E vale anche qui `View = f(State)`: cambi il dato salvato e richiami la funzione di disegno — non nascondi il form a mano, lo ridisegni diverso.

---

## ES 8 — Esercizio 9.12: contatore reattivo *(base)* — *integrato nell'app*

**Testo.** Sotto la lista, una frase che cambia in base alla situazione: nessun task → `Non hai task. Buona giornata.`; tutti completati → `Fatto tutto. Complimenti.`; altrimenti → `Ti restano 3 task su 5.` Vincolo: nessun campo nuovo nello stato, nessuna variabile globale in più.

**Soluzione.** In `index.html`, sotto la lista: `<p id="messaggio"></p>`. Dentro `render()`:

```js
const totali = tasks.length
const restanti = totali - completati

let frase
if (totali === 0) {
  frase = "Non hai task. Buona giornata."
} else if (restanti === 0) {
  frase = "Fatto tutto. Complimenti."
} else {
  frase = `Ti restano ${restanti} task su ${totali}.`
}

messaggio.textContent = frase
```

**Perché.** Tutto serve è già dentro `render()`: `tasks.length` e il conteggio dei completati. **Attento all'ordine dei casi**: "tutti completati" è vero anche quando la lista è vuota (zero completati su zero task), quindi il controllo sulla lista vuota viene prima. Il contatore è "reattivo" senza meccanismi speciali: sta dentro `render()`, e `render()` viene chiamata dopo ogni azione.

---

## ES 9 — Elimina tutti i completati *(intermedio)* — *integrato nell'app*

**Testo.** Sfida del Laboratorio 9.1 (p. 319). Pulsante *Elimina completati* che rimuove in un colpo solo tutti i task con `completed: true`. Requisiti: il pulsante compare solo quando c'è almeno un completato, e chiede conferma.

**Soluzione** (versione integrata nell'app):

```js
// azione
function deleteCompletati() {
  if (!confirm("Elimino tutti i task completati?")) return
  tasks = tasks.filter(t => !t.completed)   // tengo i NON completati
  salvaStato()
  render()
}

// dentro render(): la view decide se il pulsante esiste
azioni.innerHTML = completati > 0
  ? `<button id="pulisci">Elimina completati (${completati})</button>`
  : ""
```

**Perché.** L'operazione è la stessa di `deleteTask`, cambia solo il predicato: invece di confrontare un id, si tengono i task **non** completati. `confirm("testo")` restituisce `true`/`false`. Il pulsante mostra anche quanti ne eliminerà: dato ricavato dallo stato, coerente per costruzione.

**Nota sull'aggancio del listener.** Il pulsante viene ricreato a ogni `render()`. La versione "ingenua" riattacca il listener dentro `render()` a ogni volta: funziona, ma è spreco. La soluzione pulita — quella usata nell'app — è la **delega degli eventi** già usata sulla lista: un listener fisso sul contenitore `#azioni`, attaccato una volta sola fuori da `render()`:

```js
azioni.addEventListener("click", (evento) => {
  if (evento.target.id === "pulisci") {
    deleteCompletati()
  }
})
```

---

## Sfida finale (facoltativa) — i completati in fondo

**Testo.** Ordina la lista mettendo in fondo i completati, senza aggiungere campi allo stato: l'ordinamento lo decide il render.

**Soluzione** (in `render()`, già attiva nell'app):

```js
const ordinate = [...tasks].sort(
  (a, b) => Number(a.completed) - Number(b.completed)
)

lista.innerHTML = ordinate.map(/* ... */).join("")
```

**Perché.** `Number(false)` vale `0`, `Number(true)` vale `1`: l'ordine crescente mette i da fare prima e i completati in fondo. Lo stato resta nell'ordine di inserimento: è la *vista* a essere ordinata diversamente. Serve `[...tasks]` — una copia — perché `sort()` **modifica** l'array su cui viene chiamato, e lo stato non si tocca. Per disattivare la sfida basta cancellare quelle righe e tornare a mappare `tasks`.
