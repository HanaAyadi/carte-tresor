import { FormControl } from '@angular/forms';
import { MadreDeDiosComponent } from './madre-de-dios.component';

describe('MadreDeDiosComponent', () => {
  const setup = () => {
    const builder = {
      config() {
        return builder;
      },
      build() {
        return new MadreDeDiosComponent();
      },
    };

    return builder;
  };
  it('should created', () => {
    const component = setup().config().build();
    expect(component).toBeDefined();
  });

  it('getData', () => {
    const component = setup().config().build();

    component.data = new FormControl(
      `C - 3 - 4\nM - 1 - 0\nM - 2 - 1\nT - 0 - 3 - 2\nT - 1 - 3 - 3\nA - Lara - 1 - 1 - S - AADADAGGA`
    );
    component.getData();
    expect(component.height).toEqual(4);
    expect(component.width).toEqual(3);
    expect(component.InitialPlayerPositionX).toEqual(1);
    expect(component.InitialPlayerPositionY).toEqual(1);
    expect(component.playerSequence).toEqual(' AADADAGGA');
    expect(component.playerDirection).toEqual('S');
    expect(component.playerName).toEqual(' Lara ');
    expect(component.playerPositionX).toEqual(0);
    expect(component.playerPositionY).toEqual(3);
    expect(component.playerAward).toEqual(3);
  });

  it('restart', () => {
    const component = setup().config().build();
    component.restart();
    expect(component.informations).toEqual([]);
    expect(component.card).toEqual([]);
    expect(component.resultCard).toEqual([]);
  });

  it('getCardWithPlayer', () => {
    const component = setup().config().build();
    component.data = new FormControl(
      `C - 3 - 4\nM - 1 - 0\nM - 2 - 1\nT - 0 - 3 - 2\nT - 1 - 3 - 3\nA - Lara - 1 - 1 - S - AADADAGGA`
    );
    component.getData();
    const result = component.getCardWithPlayer(
      [
        ['.', 'M', '.'],
        ['.', '.', 'M'],
        ['.', '.', '.'],
        ['T(0)', 'T(2)', '.'],
      ],
      0,
      3
    );
    expect(result).toEqual([
      ['.', 'M', '.'],
      ['.', '.', 'M'],
      ['.', '.', '.'],
      ['A( Lara )', 'T(2)', '.'],
    ]);
  });

  it('getFinalInformation', () => {
    const component = setup().config().build();
    component.data = new FormControl(
      `C - 3 - 4\nM - 1 - 0\nM - 2 - 1\nT - 0 - 3 - 2\nT - 1 - 3 - 3\nA - Lara - 1 - 1 - S - AADADAGGA`
    );
    component.getData();
    const infoResult = component.getFinalInformation([
      ['.', 'M', '.'],
      ['.', '.', 'M'],
      ['.', '.', '.'],
      ['T(0)', 'T(2)', '.'],
    ]);
    expect(infoResult).toEqual([
      'C - 3 - 4',
      'M - 1 - 0 ',
      'M - 2 - 1 ',
      'T - 1 - 3 - 2 ',
      'A - 0 - 3 - S - 3',
    ]);
  });
});
