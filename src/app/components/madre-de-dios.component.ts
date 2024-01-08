import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SplitterModule } from 'primeng/splitter';

@Component({
  selector: 'carte-tresor-madre-de-dios',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    SplitterModule,
    InputTextareaModule,
  ],
  templateUrl: './madre-de-dios.component.html',
  styleUrl: './madre-de-dios.component.scss',
})
export class MadreDeDiosComponent {
  directions = ['N', 'E', 'S', 'O'];
  data: FormControl = new FormControl('');
  //tableau avec les infos saisies en entree
  informations: string[] = [];
  //taille de la carte
  width: number = 0;
  height: number = 0;
  card: string[][] = [];
  resultCard: string[][] = [];
  playerPositionX: number = 0;
  playerPositionY: number = 0;
  InitialPlayerPositionX: number = 0;
  InitialPlayerPositionY: number = 0;
  playerSequence: string = '';
  playerDirection: string = '';
  playerAward = 0;
  playerName = '';

  /**
   * Récuperer les infos saisies auclavier
   */
  getData() {
    this.restart();
    for (const info of this.data.value.split('\n')) {
      const steps = info.split('-');
      const vertical = Number(steps[2]);
      const horizental = Number(steps[1]);
      this.informations.push(info);
      /**
       * Récuperation de la taille de la carte et initialisation d'une carte vide
       */
      if (info.startsWith('C')) {
        this.card = [];
        this.height = vertical;
        this.width = horizental;
        for (let i = 0; i < this.height; i++) {
          let tab = [];
          for (let j = 0; j < this.width; j++) {
            tab.push('.');
          }
          this.card.push(tab);
        }
      } else if (info.startsWith('M')) {
        /**
         *Recuperation des montages
         */
        this.card[vertical][horizental] = 'M';
      } else if (info.startsWith('T')) {
        /**
         *Recuperation des tresors
         */
        this.card[vertical][horizental] = 'T(' + steps[3].trim() + ')';
      } else if (info.startsWith('A')) {
        /**
         *Recuperation de l'aventerier
         */
        this.InitialPlayerPositionY = Number(steps[2]);
        this.InitialPlayerPositionX = Number(steps[3]);
        this.playerPositionX = this.InitialPlayerPositionX;
        this.playerPositionY = this.InitialPlayerPositionY;
        this.playerSequence = steps[5];
        this.playerDirection = steps[4];
        this.playerName = steps[1];
      }
    }
    this.resultCard = cloneDeep(this.card);

    this.startToPlay();
  }
  /**
   * Recommencer le jeux
   */
  restart() {
    this.informations = [];
    this.card = [];
    this.resultCard = [];
  }

  private startToPlay() {
    const playerSteps = this.playerSequence
      .split('')
      .filter((el) => el !== ' ');
    playerSteps.forEach((step) => {
      switch (step) {
        case 'A':
          /**
           * avancer le joueur
           */
          this.findNewPlayerPlace(this.playerDirection.trim());
          break;
        case 'D':
          /**
           * Récuperer la nouvelle direction
           */
          const indexDirectionD = this.directions.indexOf(
            this.playerDirection.trim()
          );

          if (indexDirectionD === this.directions.length - 1) {
            this.playerDirection = this.directions[0];
          } else {
            this.playerDirection = this.directions[indexDirectionD + 1];
          }

          break;

        case 'G':
          /**
           * Récuperer la nouvelle direction
           */
          const indexDirectionG = this.directions.indexOf(
            this.playerDirection.trim()
          );

          if (indexDirectionG === 0) {
            this.playerDirection = this.directions[this.directions.length - 1];
          } else {
            this.playerDirection = this.directions[indexDirectionG - 1];
          }
          break;
      }
    });
  }
  findNewPlayerPlace(d: string) {
    let newPlayerPositionX = this.playerPositionX;
    let newPlayerPositionY = this.playerPositionY;
    switch (d) {
      case 'S':
        newPlayerPositionY++;
        break;
      case 'E':
        newPlayerPositionX++;
        break;

      case 'N':
        newPlayerPositionY--;
        break;

      case 'O':
        newPlayerPositionX--;
        break;
    }
    /**
     * on commence par verifier si le prochain step n'est pas une montagne
     */
    const nextStep = this.resultCard[newPlayerPositionY][newPlayerPositionX];
    if (nextStep !== 'M') {
      if (nextStep.startsWith('T')) {
        const nbTresor =
          Number(
            this.resultCard[newPlayerPositionY][newPlayerPositionX]
              .split('(')[1][0]
              .trim()
          ) - 1;

        this.resultCard[newPlayerPositionY][newPlayerPositionX] =
          'T(' + nbTresor + ')';
        this.playerAward++;
      }
    }

    this.playerPositionX = newPlayerPositionX;
    this.playerPositionY = newPlayerPositionY;
  }
  getCardWithPlayer(card: string[][], x: number, y: number): string[][] {
    let cardWithPlayer = cloneDeep(card);
    if (card.length) {
      cardWithPlayer[y][x] = 'A' + '(' + this.playerName + ')';
    }
    return cardWithPlayer;
  }
  getFinalInformation(card: string[][]): string[] {
    let infos: string[] = [];
    if (this.informations.length) {
      infos.push(this.informations[0]);
      for (let i = 0; i < card.length; i++) {
        for (let j = 0; j < card[0].length; j++) {
          if (card[i][j] === 'M') {
            infos.push(`M - ${j} - ${i} `);
          }
          if (card[i][j].startsWith('T')) {
            const nb = Number(card[i][j].split('(')[1][0].trim());
            if (nb) {
              infos.push(`T - ${j} - ${i} - ${nb} `);
            }
          }
        }
      }
      infos.push(
        `A - ${this.playerPositionX} - ${this.playerPositionY} - ${this.playerDirection} - ${this.playerAward}`
      );
    }
    return infos;
  }
}
