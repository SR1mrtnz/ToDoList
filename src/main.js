import "./style.css"

/* ============================================================
   TO-DO LIST — Vanilla JavaScript
   Settimane 5 e 6 · TPSIT classe quinta
   Rif. Pollini vol. 3, cap. 9.4 (pp. 290–298), Laboratorio 9.1 (p. 319)

   Struttura del file (sezione 08 del tutorial — "Guarda l'ordine
   dei blocchi"): stato, view, azioni, eventi, avvio.

   Flusso completo di ogni interazione:
   azione utente → modifica dello stato → salvaStato() → render()
   ============================================================ */

/* ================= 1. STATO ================= */

const CHIAVE = "todo-tasks"      // chiave localStorage dei task
const CHIAVE_NOME = "todo-nome"  // chiave localStorage del nome (ES 7)

/*
 * ES 5 — "Proteggersi dai dati rotti"
 * localStorage restituisce una stringa: qui la deserializzo con
 * JSON.parse. Due difese:
 * 1) alla primissima visita getItem restituisce null → lista vuota;
 * 2) se la stringa non è JSON valido, parse solleva un'eccezione:
 *    la intercetto con try...catch e riparto da zero invece di
 *    lasciare l'app morta con un SyntaxError (p. 285–286 del libro:
 *    mai lasciare un catch vuoto, almeno registra l'errore).
 * Array.isArray copre anche un JSON valido ma della forma sbagliata:
 * "42" è JSON legale, ma 42.map(...) non esiste.
 */
function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return []      // prima visita: nessun dato salvato

  try {
    const dati = JSON.parse(testo)
    return Array.isArray(dati) ? dati : []
  } catch (errore) {
    console.error("Dati salvati non validi, riparto da zero:", errore.message)
    return []
  }
}

/*
 * Lo stato è UN array di oggetti: la single source of truth.
 * Un task ha tre campi: id (Date.now(), stabile), title, completed.
 * let e non const: le azioni immutabili producono un array NUOVO
 * e la variabile va riassegnata.
 */
let tasks = caricaStato()

/* ================= 2. RIFERIMENTI ALLA PAGINA ================= */

const lista     = document.querySelector("#lista")
const info      = document.querySelector("#info")
const form      = document.querySelector("#form-task")
const campo     = document.querySelector("#campo-task")
const messaggio = document.querySelector("#messaggio")   // ES 8
const azioni    = document.querySelector("#azioni")      // ES 9
const benvenuto = document.querySelector("#benvenuto")   // ES 7

/* ================= 3. PERSISTENZA ================= */

/*
 * localStorage memorizza SOLO stringhe (sezione 07): un array
 * verrebbe convertito in "[object Object],..." e i dati si perdono.
 * JSON.stringify lo serializza in una stringa JSON; alla lettura
 * JSON.parse ricostruisce l'array, tipi compresi (completed torna
 * booleano, non la stringa "true").
 */
function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

/* ================= 4. VIEW ================= */

/*
 * render() è "stupida" (p. 291): legge lo stato e disegna, non
 * decide e non ricorda niente. Ricostruisce tutta la lista da zero:
 * è la formula View = f(State) del cap. 3.2.1 (p. 93).
 * Per questo lista e contatore non possono mai disallinearsi: sono
 * scritti dalla stessa funzione, dalla stessa fonte.
 */
function render() {
  /*
   * SFIDA FINALE (opzionale) — i completati in fondo.
   * L'ordinamento lo decide il render, lo stato resta nell'ordine
   * di inserimento: nessun campo nuovo, nessun riordino permanente.
   * [...tasks] è una copia, perché sort() modifica l'array su cui
   * viene chiamato. Per disattivare la sfida: elimina queste righe
   * e torna a mappare `tasks` nella riga qui sotto.
   */
  const ordinate = [...tasks].sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  )

  /* map() produce un array di stringhe, join("") le unisce in una
     sola (senza le virgole). Ogni riga porta il proprio id dentro
     l'attributo data-id: è così che i click ritrovano il task. */
  lista.innerHTML = ordinate
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")

  /* ES 2 — conteggio dei task da fare.
     Si RICAVA dallo stato con filter, non si memorizza da nessuna
     parte: se fosse un campo, prima o poi divergerebbe. */
  const completati = tasks.filter(t => t.completed).length
  const daFare = tasks.filter(t => !t.completed).length
  info.textContent =
    `Totali: ${tasks.length} · Completati: ${completati} · Da fare: ${daFare}`

  /* ES 8 — esercizio 9.12: frase reattiva.
     Nessun campo nuovo nello stato e nessuna variabile globale in
     più: la frase si calcola qui, a ogni render. "Reattiva" solo
     perché render() viene richiamata dopo ogni azione.
     Attenzione all'ordine dei casi: "tutti completati" è vero
     anche a lista vuota (0 su 0), quindi il controllo sulla lista
     vuota viene PRIMA. */
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

  /* ES 9 — il pulsante "Elimina completati" esiste solo se c'è
     almeno un task completato: è la view a decidere, guardando lo
     stato. Mostra anche quanti ne eliminerà: dato ricavato dallo
     stato, coerente per costruzione. */
  azioni.innerHTML = completati > 0
    ? `<button id="pulisci">Elimina completati (${completati})</button>`
    : ""
}

/* ================= 5. AZIONI ================= */

/*
 * ES 4 — una sola riga di salvataggio invece di tre.
 * Tutte le azioni facevano la stessa coppia salvaStato() + render().
 * Ora fanno una cosa sola: calcolano il NUOVO array con le formule
 * immutabili della settimana 3 e lo passano ad aggiornaStato(),
 * che riassegna lo stato, salva e ridisegna.
 * È il parente povero di setTasks in React: nella settimana 8 la
 * riconoscerai.
 */
function aggiornaStato(nuoviTasks) {
  tasks = nuoviTasks
  salvaStato()
  render()
}

/* Azione 1 — aggiungere: [...tasks, nuovo] produce un array nuovo,
   niente push. trim() toglie gli spazi alle estremità e il return
   anticipato blocca i task vuoti. Un task nasce completed: false. */
function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return

  aggiornaStato([...tasks, { id: Date.now(), title: pulito, completed: false }])
}

/* Azione 2 — completare/riaprire: map() con lo spread produce una
   copia del task con completed invertito. Il ramo ": t" NON è
   opzionale: map() restituisce sempre un array della stessa
   lunghezza, ogni elemento va rimpiazzato da qualcosa. */
function toggleTask(id) {
  aggiornaStato(
    tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
  )
}

/* Azione 3 — eliminare: filter() TIENE gli elementi per cui il
   predicato è vero, quindi per eliminare uno si tengono tutti quelli
   con id DIVERSO (t.id !== id). Con === resterebbe solo il task da
   cancellare e la lista si svuoterebbe, senza nessun errore. */
function deleteTask(id) {
  aggiornaStato(tasks.filter(t => t.id !== id))
}

/* ES 9 — sfida del Laboratorio 9.1 (p. 319): elimina in un colpo
   solo tutti i task completati, dopo conferma con confirm().
   Nel libro i task stanno su PocketBase e si cancellano con una
   serie di chiamate DELETE; qui basta un filter sullo stato locale. */
function deleteCompletati() {
  if (!confirm("Elimino tutti i task completati?")) return
  aggiornaStato(tasks.filter(t => !t.completed))   // tengo i NON completati
}

/* ================= 6. EVENTI ================= */

/* Il form: "submit" scatta sia col click sul pulsante sia con
   Invio da tastiera. preventDefault() è OBBLIGATORIO: il
   comportamento predefinito di un form ricarica la pagina, e lo
   stato tornerebbe quello iniziale. */
form.addEventListener("submit", (evento) => {
  evento.preventDefault()
  addTask(campo.value)
  campo.value = ""     // svuota il campo
  campo.focus()        // e rimette il cursore dentro
})

/* La lista: UN solo listener per tutti i task (delega degli eventi).
   I <li> nascono e muoiono a ogni render; il <ul> contenitore non
   viene mai ricreato, quindi il listener si attacca una volta sola.
   Number() non si dimentica: gli attributi HTML sono SEMPRE stringhe,
   e "3" === 3 è falso (la regola della settimana 1). */
lista.addEventListener("click", (evento) => {
  const elemento = evento.target

  // click sul pulsante di eliminazione
  if (elemento.classList.contains("elimina")) {
    deleteTask(Number(elemento.dataset.id))
    return
  }

  // click in un punto qualsiasi della riga: completare/riaprire
  const riga = elemento.closest("li")
  if (riga) {
    toggleTask(Number(riga.dataset.id))
  }
})

/* ES 9, versione pulita suggerita dal tutorial: anche qui delega
   degli eventi invece di riattaccare il listener a ogni render.
   Il pulsante viene ricreato a ogni render, il contenitore #azioni
   no: il listener sta qui, fuori da render(), una volta sola. */
azioni.addEventListener("click", (evento) => {
  if (evento.target.id === "pulisci") {
    deleteCompletati()
  }
})

/* ================= 7. BENVENUTO (ES 7 · esercizio 9.11) ================= */

/*
 * Alla prima apertura chiede il nome e lo salva; dalle visite
 * successive mostra "Bentornato, Nome", senza chiedere più niente.
 * Il nome è una stringa semplice: entra in localStorage così com'è,
 * senza JSON.stringify, con una chiave DIVERSA da quella dei task.
 * Vale anche qui View = f(State): si cambia il dato salvato e si
 * ridisegna — non si nasconde il form a mano.
 */
function renderBenvenuto() {
  const nome = localStorage.getItem(CHIAVE_NOME)

  if (nome) {
    benvenuto.innerHTML = `<p>Bentornato, ${nome}</p>`
    return
  }

  benvenuto.innerHTML = `
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

/* ================= 8. AVVIO ================= */

/* render() si chiama: una volta all'avvio, e alla fine di ogni
   azione che ha modificato lo stato. Mai in altri momenti. */
render()
renderBenvenuto()
