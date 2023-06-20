# iHoover App

## Kécecé ce truc ?
iHoover App est un projet React qui met en scène un aspirateur capable de se déplacer sur une grille selon des instructions données.

## Installation
Clonez le repo sur votre machine via la commande `git clone https://github.com/TomPillet/ihoover.github.io.git`

Vous pouvez ensuite vous rendre dans le dossier du projet pour y exécuter les commandes suivantes : 
```
npm install
npm run start
```

L'application se lancera dans votre navigateur par défaut, prête à l'utilisation.

## Comment utiliser iHoover App ?
À l'heure actuelle, il est possible de mouvoir l'aspirateur selon deux modes d'instructions :
  - le mode manuel (par défaut), où l'on appuie sur un bouton pour mouvoir l'appareil ;
  - le mode script, où l'on inscrit un script d'automatisation selon le langage compris par l'aspirateur (cf ### Comment faire un script ?).

Pour alterner entre les différents modes d'instructions, cliquez sur le switcher à droite de la grille.

![image](https://github.com/TomPillet/ihoover.github.io/assets/76454484/b7dbd791-96d4-4a9d-9e86-ff962010e17e)

Vous pouvez également modifier le nombre de cases sur les différents axes de la grille, via les inputs de paramétrages situés juste au-dessus, ainsi que suivre les informations sur l'aspirateur (coordonées X et Y + directions **N**ord, **E**st, **S**ud, **O**uest) en temps réel.

## Donner des instructions à l'aspirateur
Comme expliqué précédemment, deux modes d'instructions sont exploitables pour déplacer l'appareil.

### Mode manuel
Si vous choisissez le mode manuel, vous aurez à votre disposition trois boutons :
  - "Droite", pour tourner l'appareil sur sa droite
  - "Gauche", pour le tourner sur sa gauche
  - "Avant", pour déplacer l'aspirateur d'une case dans la direction où il est tourné

### Mode script
Si vous choisissez le mode script, vous devrez renseigner des instructions via un bloc de texte (vide par défaut).
Ces instructions doivent obéir aux règles de langage de l'appareil, qui sont les suivantes :
  - "D" signifie "tourner à droite" et sera compris comme une rotation de 90° sur la droite
  - "G" signifie "tourner à gauche" et sera compris comme une rotation semblable sur la gauche
  - "A" signifie "avancer" et l'aspirateur avancera d'une case dans la direction renseignée

Par exemple, le script `DAGAA` dit qu'il faut tourner à droite, puis avancer d'une case, puis tourner à gauche et ravancer de deux cases.

Attention : l'aspirateur ne peut sortir de la grille. Si il se trouve en bord de cette dernière, tourné vers l'extérieure, et que le script demande à l'appareil d'avancer, cela engendrera une erreur qui annulera la suite du traitement du script.
