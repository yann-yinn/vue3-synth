// fonction d'aide qui retourne un dictoinare pour
// savoir à quelle note (fréquence en Hz)
// correspond une touche du clavier.
//
// @param startNode: Fréquence en Hz de la note de départ
// qui permet de calculer toutes les suivantes
export function keyboardMap(startFrequencey = 55): Map<string, number> {
  // https://lecompositeur.com/wp-content/uploads/2016/04/Frequences.pdf
  // Formule:
  // Fréquence = startFrequencey Hz * r puissance n
  // où n est le nombre de demi-tons et r vaut 1.05946
  const notes = new Map();
  const r = 1.05946;
  const keys = "azertyuiopqsdfghjklmwxcvbn";
  for (let i = 0; i < keys.length; i++) {
    const frequency = startFrequencey * Math.pow(r, i + 1);
    notes.set(keys[i], frequency);
  }
  return notes;
}

/**
 * @param frequency - fréquence de la note initial en Hz
 * @param demiTones - demi-tons à ajouter ou enlever
 * @returns - fréquence pitchée en Hz
 */
export function pitcher(frequency: number, demiTones: number): number {
  const r = 1.05946;
  const pitchedFrequency = frequency * Math.pow(r, demiTones);
  return pitchedFrequency;
}
