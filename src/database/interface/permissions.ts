export enum Permission { // The user can modify this in the code, there is a verification at the database level...
  STUDENT = 'Élève',
  TEACHER = 'Professeur',
  HISTORY_ADMIN = 'Administrateur historique',
  NEWS_ADMIN = "Administrateur d'actualités",
  GLOBAL_ADMIN = 'Administrateur global',
}
