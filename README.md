# BBSensors

## Projet BBSensors ##

Voici mon travail de Bachelard "BBSensors: Application mobil en milieu néonatal".

### Introduction ###

De nos jours, les nouveau-nés prématurés sont encore des patients critiques et demandent un suivi rigoureux et constant.
Dans le cadre du projet de recherche "BBSensors : un système portable sans fils et miniaturisé pour le monitoring de signaux vitaux en milieu néonatal" en collaboration avec les HUG et la HEIG-VD, nous désirons déterminer la présence d'anomalies cardiaques et respiratoires chez les nouveau-nés prématurés. Ces anomalies se basent sur l’analyse des signes vitaux en provenance d'un électrocardiogramme et d'un oxymètre.
Actuellement, en cas d’alerte d’un patient, le moniteur ECG sonne pour prévenir le personnel soignant. Par contre, cet appareil se trouve dans la chambre du bébé et ne peut être déplacé. Comme le personnel soignant est toujours en mouvement (dû à leur travail), le temps de réaction est variable.
L’étape clé du projet est de transmettre les valeurs mesurées par les différents capteurs ainsi que les anomalies vers un périphérique mobile utilisé par les médecins et le personnel soignant. Il s'agit donc de développer une application mobile hybride (iOS & Android) qui communique avec un système embarqué.
Le périphérique reçoit les données traitées et les alertes. Ces alertes permettent d’informer le personnel soignant qu’un patient est en danger (fréquence cardiaque trop basse, arrêt cardiaque…) pour que le temps de réaction soit le plus bref possible.
La création de l’application hybride est développée via le Framework1 Ionic. Elle est multi plateforme et déployable sur le store.

### Objectifs ###

Le but de ce projet est de concevoir une application mobile hybride permettant aux médecins et aux personnels soignants d’avoir une vision de l’état des patients.
Il est demandé que l’application remplisse les points suivants :

   - Pouvoir communiquer avec le module Reptar qui transmet toutes les données des différents capteurs du patient.

   - Permettre l’ajout, la modification ou encore la suppression des patients suivis.

   - Mémoriser les patients sur le téléphone pour qu’il ne soit pas nécessaire de les rajouter à chaque activation de celle-ci.

   - Afficher les données des différents capteurs connectés sur le patient comme les fréquences et les signaux, qui doivent être en temps réel comme sur le moniteur ECG de     l’hôpital.

   - Prévenir (sonore, vibration, visuelle) lorsqu’un patient présente des symptômes ou est en danger.

   - Permettre la visualisation d’un signal d’alerte passé. Il servira au médecin et au personnel soignant de pouvoir analyser le signal d’une ancienne alerte.

   - L’application doit être la plus simple et Plug&Play3 possible pour que les utilisateurs n’aient pas de difficulté à la compréhension et à l’utilisation. Le plug and Play est sollicité pour gérer l’association moniteur <-> patient.

### Contenu du dossier ###

   - Mémoire
   - Projet (code source)
   - Vidéo (démo du projet)

### Démo

Il est impoSsible de tester le programme pour une question de confidancialité, car le serveur renvois des véritables données de patient. Parcontre, vous trouvez une vidéo illustrant les différentes fonctionnalités de l'API.
