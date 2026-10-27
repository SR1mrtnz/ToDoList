# Guida Git + GitHub — caricare la To-Do List sul repository

Il tutorial lo chiede esplicitamente (sezione 08, «Prima di chiudere la lezione»): *"Copia la cartella del progetto in un posto sicuro: chiavetta, cartella personale in rete, **repository Git**"*. GitHub è anche il modo più comodo per portare il progetto in laboratorio e ritrovarlo tra due settimane per il confronto con React.

Questa guida assume che il progetto sia già un repository Git **inizializzato con il primo commit già fatto** (è stato fatto per te, vedi passo 2).

---

## 1. Che cos'è Git e che cos'è GitHub (2 minuti)

- **Git** è un programma che registra la **storia delle versioni** di una cartella: ogni salvataggio (*commit*) resta registrato con la data e un messaggio, e puoi sempre tornare indietro.
- **GitHub** è un sito che ospita repository Git **online**: il tuo progetto ha così un backup remoto, un indirizzo e una pagina visibile (`github.com/tuonome/todo-vanilla`).

Il lavoro avviene **in locale** con Git; GitHub serve a conservare e sincronizzare.

---

## 2. Che cosa è già stato fatto (verificalo)

Dentro la cartella `todo-vanilla` è già stato eseguito:

```bash
git init                      # trasforma la cartella in repository Git
git add .                     # mette in scena i file del progetto
git commit -m "Primo commit: To-Do List vanilla JS"   # salva la prima versione
```

Per verificare che tutto sia a posto:

```bash
git status                    # deve dire "nothing to commit, working tree clean"
git log --oneline             # deve mostrare il primo commit
```

Se invece la cartella parte da zero (per esempio se l'hai ricreata), rifai i tre comandi qui sopra partendo da `git init`. **Prima però** controlla che nella cartella ci siano `.gitignore`, `index.html`, `src/`, `package.json`: il commit deve contenerli.

---

## 3. Configurazione una volta sola (solo se non l'hai già fatta)

Git deve sapere chi firma i commit. In un terminale:

```bash
git config --global user.name "Nome Cognome"
git config --global user.email "la-tua-email@esempio.com"
```

Usa la stessa email dell'account GitHub, così i commit risultano tuoi sul sito.

---

## 4. Creare il repository su GitHub

1. Vai su <https://github.com> e accedi (se non hai un account: **Sign up**, è gratuito).
2. In alto a destra: icona `+` → **New repository**.
3. Repository name: `todo-vanilla` (lo stesso nome della cartella: meno confusione).
4. Visibilità: **Private** va benissimo per un progetto scolastico (Public se lo vuoi mostrare nel portfolio).
5. **Non spuntare** "Add a README file", né ".gitignore", né "license": il repository deve nascerne **vuoto**, perché il tuo progetto esiste già. Se lo popoli da GitHub poi i due storici non combaciano e il primo push si complica.
6. Clicca **Create repository**. GitHub ti mostra una pagina di istruzioni: ti serve solo l'**indirizzo del repository**, che assomiglia a:

   ```
   https://github.com/TUONOME/todo-vanilla.git
   ```

---

## 5. Collegare il progetto a GitHub e caricarlo (i 3 comandi)

Nel terminale di VS Code, dentro la cartella `todo-vanilla`:

```bash
git remote add origin https://github.com/TUONOME/todo-vanilla.git
git branch -M main
git push -u origin main
```

Che cosa fanno, riga per riga:

| Comando | Che cosa fa |
|---|---|
| `git remote add origin …` | registra il repository online sotto il soprannome `origin` (lo fai **una volta sola**) |
| `git branch -M main` | rinomina il ramo principale in `main` (lo fai **una volta sola**) |
| `git push -u origin main` | carica i commit su GitHub; `-u` memorizza la destinazione, così la prossima volta basta `git push` |

Aggiorna la pagina di GitHub nel browser: il progetto ci deve essere, con README, `src/`, `esercizi/` — e **senza** `node_modules` (la sa escludere il `.gitignore`).

---

## 6. Il workflow di ogni giorno (da memorizzare)

Ogni volta che finisci un pezzo di lavoro sensato:

```bash
git status                  # che cosa è cambiato
git add .                   # metti in scena tutto ciò che è cambiato
git commit -m "Aggiungo il conteggio dei da fare"   # salva la versione LOCALE
git push                    # carica su GitHub
```

Buoni messaggi di commit: brevi, al presente, dicono **che cosa fa** la modifica ("Aggiungo il pulsante elimina completati"), non "modifiche", "fix", "cose".

---

## 7. Riprendere il lavoro su un altro PC (es. dal laboratorio)

Su una macchina diversa non serve la chiavetta: il repository è su GitHub.

```bash
git clone https://github.com/TUONOME/todo-vanilla.git
cd todo-vanilla
npm install      # ricostruisce node_modules da package.json
npm run dev      # l'app funziona di nuovo
```

Alla fine della lezione, per non perdere nulla:

```bash
git add .
git commit -m "Avanzamento di oggi"
git push
```

Il PC di casa, la volta dopo, prima di iniziare: `git pull` (scarica ciò che hai caricato da scuola).

**Nota sui task salvati:** localStorage è legato al browser della macchina che usi, non viaggia col repository. Su GitHub finisce il **codice**; i task di prova li ricrei dove ti serve.

---

## 8. Perché il `.gitignore` è importante

Nella cartella del progetto ci sono migliaia di file (`node_modules/`) che non hai scritto tu e che `npm install` ricostruisce da `package.json` in un minuto. Caricarli su GitHub significherebbe migliaia di file inutili e un repository pesantissimo — per questo la settimana 4 ti ha già detto di **non copiare mai `node_modules`**. Il file `.gitignore` dice a Git quali cartelle ignorare (nella guida del progetto c'è già quello giusto) e Git smette di vederle, come se non esistessero.

---

## 9. Problemi comuni e rimedi

| Sintomo | Causa | Rimedio |
|---|---|---|
| Il push chiede username e password, ma la password non funziona | GitHub non accetta la password: vuole un **Personal Access Token** | Su GitHub: Settings → Developer settings → Personal access tokens → **Generate new token (classic)**, spunta `repo`, copia il token e usalo al posto della password |
| Non vuoi occuparti di token | — | Installa **GitHub Desktop** (desktop.github.com): fa login col browser e push/pull con due pulsanti |
| `error: remote origin already exists` | hai già registrato `origin`, forse con l'indirizzo sbagliato | `git remote set-url origin https://github.com/TUONOME/todo-vanilla.git` |
| `rejected (fetch first)` | su GitHub c'è qualcosa che in locale non hai (es. avevi creato il README dal sito) | `git pull --rebase origin main` e poi di nuovo `git push` |
| Ho caricato `node_modules` per sbaglio | `.gitignore` mancante al momento del commit | crea/ripara `.gitignore`, poi: `git rm -r --cached node_modules` → `git commit -m "Rimuovo node_modules"` → `git push` |
| Su un altro PC `npm run dev` dà errori | mancano le dipendenze | esegui prima `npm install` |

---

## 10. Checklist finale

- [ ] `git status` pulito, `git log --oneline` mostra i commit
- [ ] Repository creato su GitHub **vuoto** (senza README generato dal sito)
- [ ] `git remote add origin …` + `git branch -M main` + `git push -u origin main`
- [ ] Su GitHub si vedono: `README.md`, `index.html`, `src/`, `esercizi/`, `SOLUZIONI-ESERCIZI.md`, `GIT-GUIDA.md`, `package.json`
- [ ] Su GitHub **non** si vede `node_modules/`
- [ ] Prova su un altro PC: `git clone` → `npm install` → `npm run dev` funziona

Il progetto è così al sicuro: backup, storia delle versioni e pronto per la settimana 8.
