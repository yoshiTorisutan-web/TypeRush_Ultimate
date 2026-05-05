# ⌨️ TypeRush Ultimate

> Un jeu de frappe au clavier rapide, beau et complet — entièrement en HTML/CSS/JS vanilla.

---

## 🚀 Lancement

Aucune installation requise. Ouvre simplement `index.html` dans ton navigateur.

```
typerush/
├── index.html   ← Structure de la page
├── style.css    ← Thèmes, mise en page, animations
├── app.js       ← Logique du jeu, sons, graphiques
└── README.md    ← Ce fichier
```

---

## 🎮 Modes de jeu

| Mode | Description |
|------|-------------|
| ⏱️ **Chrono** | Tape le plus vite possible avant la fin du timer |
| 🧘 **Zen** | Pas de limite de temps, stats à la fin |
| 💀 **Sudden Death** | Une seule erreur = game over |
| 🏃 **Marathon** | Texte très long, tiens le plus longtemps possible |

---

## 📝 Sources de contenu

- 🇫🇷 **Mots FR** — phrases du quotidien en français
- 🇬🇧 **Mots EN** — phrases en anglais
- 💬 **Citations** — citations de personnalités célèbres
- 💻 **Code** — extraits JavaScript réels
- 🔢 **Chiffres** — séquences numériques
- ✏️ **Custom** — colle n'importe quel texte

---

## ⚙️ Fonctionnalités

- 📊 **Courbe WPM en temps réel** — graphique qui se dessine pendant la frappe
- 🎯 **Score de pertinence** — WPM, précision, erreurs, chars corrects
- 🔥 **Heatmap des touches** — visualise tes touches les plus ratées après chaque partie
- 🏆 **Confettis** — animation quand tu bats ton record
- 💾 **Historique persistant** — tes 50 dernières parties sauvegardées en localStorage
- 📈 **Onglet Statistiques** — graphique de progression, top 10, stats globales

---

## ⚔️ Multijoueur local

Deux joueurs sur le même clavier, côte à côte. Le premier à finir le texte gagne.

---

## 🎨 Thèmes

| Couleur | Ambiance |
|---------|----------|
| 🟣 **Dark** | Violet sombre (défaut) |
| 🟠 **Amber** | Terminal rétro orange |
| 🟢 **Hacker** | Matrix vert fluo |
| 🟣 **Pastel** | Doux et clair |
| ⚪ **Light** | Mode jour |

---

## ⌨️ Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Echap` | Réinitialiser la partie |
| `Tab` | Nouveau texte |

---

## 🔊 Sons de frappe

Générés via Web Audio API, aucune dépendance externe :

- 🔇 **Off** — silencieux
- ⌨️ **Méca** — clavier mécanique
- 🎵 **Soft** — touches douces
- 👾 **Rétro** — son 8-bit

---

## 🛠️ Stack technique

- HTML5 sémantique
- CSS custom properties (variables de thème)
- JavaScript ES6+ vanilla
- [Chart.js](https://www.chartjs.org/) — graphiques WPM
- Web Audio API — sons de frappe
- Canvas API — confettis
- localStorage — persistance de l'historique
