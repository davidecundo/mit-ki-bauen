# AGENTS.md – Regeln für alle Agents in diesem Repo

> Vorlage. Ersetze alles in `<spitzen Klammern>` durch deine Angaben.
> Lege die Datei ins Hauptverzeichnis deines Repos. Für Claude Code kannst du zusätzlich eine `CLAUDE.md` mit dem Satz «Alle Regeln stehen in AGENTS.md» anlegen.

Dieses Repo ist `<Projektname>` von `<Name>`.
`<Name>` ist kein Programmierer. Alles muss ohne Fachwissen nachvollziehbar sein.

Lies auch [GUARDRAILS.md](./GUARDRAILS.md) und [FREIGABE-REGELN.md](./FREIGABE-REGELN.md), bevor du etwas änderst.

## Arbeitsweise

- Arbeite nur über Pull Requests. Nie direkt auf `main` pushen.
- Ein PR = eine Sache. Lieber zwei kleine als ein grosser.
- PR-Titel in einfachem Deutsch, ohne Präfix wie «feat:».
- Nutze die PR-Vorlage (`.github/pull_request_template.md`). Ganz oben, in einfachen Worten:
  1. **Was ändert sich?** (für Besucher oder Nutzer)
  2. **Warum?**
  3. **Risiko:** niedrig / mittel / hoch, mit einem Satz Begründung
  4. **So kannst du es prüfen:** Test-Link oder Screenshots
  5. **Was passiert nach dem Merge?**
  6. **Empfehlung**
- Technische Details kommen darunter, eingeklappt in `<details>`.
- Markiere einen PR erst als «ready», wenn die CI grün ist.
- Prüfe vor jedem PR lokal: `<Installationsbefehl> && <Prüfbefehl> && <Build-Befehl>`.

## Inhalte

- Sprache: `<Deutsch (Schweiz)>`. Immer «ss», nie das scharfe S. Besucher werden mit «du» angesprochen.
- Code, Dateinamen und Bezeichner bleiben Englisch.
- Keine erfundenen Zahlen, Kunden, Zitate oder Behauptungen. Fehlt ein Fakt, frag nach.
- Texte, die noch nicht freigegeben sind, bleiben als Platzhalter in `[eckigen Klammern]` im Quelltext und werden nie angezeigt.

## Technik in Kürze

- Stack: `<z. B. Astro + Tailwind, statisch>`
- Build: `<npm run build>`, Ausgabe in `<dist/>`
- Zentrale Einstellungen: `<Pfad zur Konfigurationsdatei>`
- Deploy: `<Hosting>`, macht ausschliesslich `<Name>` (siehe FREIGABE-REGELN.md)
