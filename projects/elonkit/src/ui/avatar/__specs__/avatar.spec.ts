import { Component } from '@angular/core';
import { render } from '@testing-library/angular';

import { ESAvatarComponent } from '../avatar.component';
import { ESAvatarModule } from '../avatar.module';
import { ESLocaleService, en, ru } from '../../locale';

@Component({
  template: `<es-avatar alt="Аватар" src="./test-path-to-icon">Message</es-avatar>`
})
class AvatarComponent {}

@Component({
  template: `<es-avatar>Message</es-avatar>`
})
class AvatarTypographyComponent {}

describe('Avatar', () => {
  it('Should change avatar variant', async () => {
    const component = await render(ESAvatarComponent, {
      imports: [ESAvatarModule],
      excludeComponentDeclaration: true
    });

    component.fixture.componentInstance.variant = 'round';
    component.fixture.detectChanges();
    expect(component.fixture.componentInstance.variant).toBe('round');

    component.fixture.componentInstance.variant = 'square';
    component.fixture.detectChanges();
    expect(component.fixture.componentInstance.variant).toBe('square');
  });

  it('Should change avatar properties', async () => {
    const component = await render(ESAvatarComponent, {
      componentProperties: {
        borderRadius: 48,
        size: 200
      },
      imports: [ESAvatarModule],
      excludeComponentDeclaration: true
    });

    expect(component.fixture.componentInstance.borderRadius).toBe(48);
    expect(component.fixture.componentInstance.size).toBe(200);
    expect(component.fixture.componentInstance.size).toBe(200);
  });

  it('Should enable status on input', async () => {
    const component = await render(ESAvatarComponent, {
      componentProperties: {
        showStatus: true
      },
      imports: [ESAvatarModule],
      excludeComponentDeclaration: true
    });

    expect(component.getByTestId('status')).toBeInTheDocument();
  });

  it('Should change status properties', async () => {
    const component = await render(ESAvatarComponent, {
      componentProperties: {
        showStatus: true,
        statusBorderWidth: 10,
        statusSize: 40,
        statusBorderColor: '#fff'
      },
      imports: [ESAvatarModule],
      excludeComponentDeclaration: true
    });

    expect(component.fixture.componentInstance.statusBorderWidth).toBe(10);
    expect(component.fixture.componentInstance.statusSize).toBe(40);
    expect(component.fixture.componentInstance.statusBorderColor).toBe('#fff');
  });

  it('Should render custom status icon', async () => {
    const component = await render(ESAvatarComponent, {
      componentProperties: {
        showStatus: true,
        statusSrc: 'customPath'
      },
      imports: [ESAvatarModule],
      excludeComponentDeclaration: true
    });

    expect(component.getByAltText(en.avatar.labelStatus)).toBeInTheDocument();
    expect(component.getByTestId('status')).toHaveClass('es-avatar__status_custom');
  });

  it('Should render text on input', async () => {
    const component = await render(AvatarTypographyComponent, {
      imports: [ESAvatarModule]
    });
    expect(component.getByText('Message')).toBeInTheDocument();
  });

  it('Should accept class typography', async () => {
    const component = await render(ESAvatarComponent, {
      componentProperties: {
        textTypography: 'test-class'
      },
      imports: [ESAvatarModule],
      excludeComponentDeclaration: true
    });

    expect(component.getByTestId('typography')).toHaveClass('test-class');
  });

  it('Should change locale', async () => {
    const localeService = new ESLocaleService();
    localeService.register('ru', ru);
    localeService.use('ru');

    const component = await render(ESAvatarComponent, {
      imports: [ESAvatarModule],
      componentProperties: {
        showStatus: true,
        statusSrc: 'customPath',
        src: './test-path-to-icon',
        alt: 'Аватар'
      },
      providers: [{ provide: ESLocaleService, useValue: localeService }],
      excludeComponentDeclaration: true
    });

    expect(component.getByAltText(ru.avatar.labelAvatar)).toBeInTheDocument();
    expect(component.getByAltText(ru.avatar.labelStatus)).toBeInTheDocument();
  });

  it('Should render alt text on image', async () => {
    const component = await render(ESAvatarComponent, {
      componentProperties: {
        src: './test-path-to-icon',
        alt: 'alt text'
      },
      imports: [ESAvatarModule],
      excludeComponentDeclaration: true
    });

    expect(component.getByAltText('alt text')).toBeInTheDocument();
  });
});