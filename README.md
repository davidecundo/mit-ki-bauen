# Wie ich mit KI-Agenten baue

Ich bin Key Account Manager im Verkauf, kein Entwickler. Trotzdem baue ich echte Tools, mit KI-Agenten wie Codex und Claude Code. Das geht nur, weil ich klare Regeln habe und jedes Ergebnis prüfe.

Hier liegen diese Regeln als Vorlagen. Du kannst sie für deine eigenen Projekte übernehmen.

## Prüfen als Methode

Die KI bereitet vor, ich entscheide. Daraus folgen fünf Regeln:

1. **Agents arbeiten nur über Pull Requests.** Kein Agent schreibt direkt auf `main`. Jede Änderung kommt als Vorschlag, den ich anschauen kann.
2. **Kleine PRs mit einer Zusammenfassung auf Deutsch.** Ein PR = eine Sache. Oben steht in einfachen Worten, was sich ändert, warum, wie riskant es ist und wie ich es prüfe. Technische Details sind eingeklappt.
3. **Nichts wird ohne mein OK gemergt oder veröffentlicht.** Mergen, Deployen, Löschen und Git-History umschreiben macht kein Agent von sich aus.
4. **Secrets gehören nie ins Repo.** Keine Passwörter oder Zugangsschlüssel in Code, PRs oder Logs. `.env`-Dateien liest und committet kein Agent.
5. **Die CI wacht über die Regeln.** Automatische Prüfungen laufen bei jedem PR. Erst wenn sie grün sind, schaue ich mir den PR an.

Wichtig ist der fünfte Punkt: Was eine Maschine prüfen kann, soll eine Maschine prüfen. Meine Zeit geht in die Frage, ob das Ergebnis stimmt und ob ich es so will.

## Was hier drin ist

| Datei | Wofür |
|---|---|
| [`templates/AGENTS.md`](templates/AGENTS.md) | Arbeitsregeln, die jeder Agent vor der ersten Änderung liest |
| [`templates/GUARDRAILS.md`](templates/GUARDRAILS.md) | Harte Grenzen: was ein Agent nie tut |
| [`templates/FREIGABE-REGELN.md`](templates/FREIGABE-REGELN.md) | Wer was freigibt, und wie ein OK aussieht |
| [`.github/pull_request_template.md`](.github/pull_request_template.md) | PR-Vorlage für Leute, die keinen Code lesen |
| [`examples/ci/`](examples/ci/) | GitHub-Actions-Workflow und Prüfskript für die CI |

## Die CI-Prüfung

`examples/ci/scripts/check-content.mjs` braucht nur Node.js, keine weiteren Pakete. Es prüft drei Dinge:

- **Kein scharfes S (Eszett).** Ich schreibe Schweizer Deutsch, also immer «ss». Binärdateien wie Schriften und Bilder werden übersprungen.
- **Keine verbotenen Wörter.** Die Liste steht in `content-guards.json`, zum Beispiel Namen, die nicht öffentlich sein sollen.
- **Keine Platzhalter auf der fertigen Seite.** Im Build-Ordner darf kein offener Platzhalter mehr stehen.

So übernimmst du es:

1. `examples/ci/scripts/check-content.mjs` nach `scripts/` in deinem Repo kopieren.
2. `examples/ci/content-guards.json` ins Hauptverzeichnis kopieren und die Listen anpassen.
3. `examples/ci/.github/workflows/content-guards.yml` nach `.github/workflows/` kopieren und die Build-Schritte an dein Projekt anpassen.

Lokal testen: `node scripts/check-content.mjs --require-build`

Dieses Repo prüft sich übrigens selbst mit demselben Skript (`.github/workflows/self-check.yml`).

## Wo ich das einsetze

Meine Website ist so entstanden, der Quelltext liegt im Repo [davidecundo.ch](https://github.com/davidecundo/davidecundo.ch). Auch Zusamo, eine Vereinsverwaltung, die aus meinem eigenen Vereinstool entstanden ist, baue ich nach diesen Regeln.

## Lizenz

MIT, siehe [`LICENSE`](LICENSE). Nimm, was dir hilft.
