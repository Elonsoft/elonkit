import { Component } from '@angular/core';
import { render } from '@testing-library/angular';

import { ESBadgeModule } from '../badge.module';
import { ESBadgeComponent } from '../badge.component';

@Component({
  template: ` <es-badge><span es-role="count">Count</span></es-badge> `
})
class BadgeWrapperComponent {}

describe('Badge', () => {
  it('Should change badge size', async () => {
    const component = await render(ESBadgeComponent, {
      componentProperties: {
        size: 40
      },
      imports: [ESBadgeModule],
      excludeComponentDeclaration: true
    });

    expect(component.fixture.componentInstance.size).toBe(40);
  });

  it('Should change badge offsetVertical', async () => {
    const component = await render(ESBadgeComponent, {
      componentProperties: {
        offsetVertical: 10
      },
      imports: [ESBadgeModule],
      excludeComponentDeclaration: true
    });

    expect(component.fixture.componentInstance.offsetVertical).toBe(10);
  });

  it('Should change badge offsetHorizontal', async () => {
    const component = await render(ESBadgeComponent, {
      componentProperties: {
        offsetHorizontal: 20
      },
      imports: [ESBadgeModule],
      excludeComponentDeclaration: true
    });

    expect(component.fixture.componentInstance.offsetHorizontal).toBe(20);
  });

  it('Should accept count', async () => {
    const component = await render(BadgeWrapperComponent, {
      imports: [ESBadgeModule]
    });

    expect(component.getByText('Count')).toBeInTheDocument();
  });
});
