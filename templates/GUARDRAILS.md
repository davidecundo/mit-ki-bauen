# GUARDRAILS.md – harte Grenzen

> Vorlage. Diese Regeln gelten immer, auch wenn eine Aufgabe etwas anderes nahelegt.
> Im Zweifel: anhalten, nachfragen, nichts tun.

## Nie ohne ausdrückliches OK

- Mergen, auch nicht den eigenen PR.
- Deployen oder etwas live schalten. Kein Deploy-Befehl aus dem Terminal.
- Repos, Branches, Dateien ausserhalb des Repos oder Daten in externen Diensten löschen.
- Git-History umschreiben: kein force-push, kein rebase von gepushten Commits, kein Amend auf geteilten Branches.
- DNS, Domains, Hosting- oder Kontoeinstellungen ändern.
- Etwas kaufen, ein Abo abschliessen oder eine Zahlungsart verwenden.
- Im Namen von `<Name>` eine Nachricht, E-Mail oder einen Post senden.

## Nie, auch nicht mit OK

- Secrets ins Repo, in PRs, in Issues oder in Logs schreiben. Dazu gehören Passwörter, Zugangsschlüssel und private Schlüssel.
- `.env`-Dateien lesen, ausgeben oder committen.
- Zugangsdaten ausgeben, um «kurz etwas zu testen».
- Prüfungen abschalten oder umgehen, damit die CI grün wird (`--no-verify`, Tests löschen, Regeln aufweichen).
- Persönliche Daten von Kunden, Mitgliedern oder Dritten ins Repo oder in ein KI-Tool kopieren.

## Wenn etwas blockiert ist

- Eine Ablehnung ist eine Antwort. Nicht über einen anderen Weg dasselbe versuchen.
- Stattdessen: kurz beschreiben, was blockiert ist und warum, und einen Vorschlag machen.

## Inhalte, die nicht öffentlich werden

- `<Liste: z. B. Namen von Arbeitgeber, Kunden, Lieferanten, interne Projekte>`
- Diese Begriffe stehen auch in `content-guards.json`, damit die CI sie automatisch findet.
