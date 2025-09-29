import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import KofiButton from '../components/KofiButton.vue';

describe('KofiButton Component', () => {
  let wrapper: any;

  beforeEach(() => {
    // Mock window scroll properties
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
  });

  it('should mount with required props', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should be hidden initially', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    const button = wrapper.find('[data-testid="kofi-button"]');
    expect(button.classes()).toContain('kofi-button-hidden');
  });

  it('should accept threshold prop', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser',
        threshold: 80
      }
    });

    expect(wrapper.props().threshold).toBe(80);
  });

  it('should accept animationDuration prop', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser',
        animationDuration: 500
      }
    });

    expect(wrapper.props().animationDuration).toBe(500);
  });

  it('should accept position prop', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser',
        position: 'bottom-right'
      }
    });

    expect(wrapper.props().position).toBe('bottom-right');
  });

  it('should emit kofi:shown event when becoming visible', async () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    // Simulate scroll to trigger visibility
    window.scrollY = 1400; // 70% of 2000
    window.dispatchEvent(new Event('scroll'));

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('kofi:shown')).toBeTruthy();
  });

  it('should emit kofi:hidden event when becoming hidden', async () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    // First make it visible
    window.scrollY = 1400;
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();

    // Then hide it
    window.scrollY = 0;
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('kofi:hidden')).toBeTruthy();
  });

  it('should emit kofi:clicked event when clicked', async () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    const button = wrapper.find('[data-testid="kofi-button"]');
    await button.trigger('click');

    expect(wrapper.emitted('kofi:clicked')).toBeTruthy();
  });

  it('should have correct accessibility attributes when hidden', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    const button = wrapper.find('[data-testid="kofi-button"]');
    expect(button.attributes('aria-hidden')).toBe('true');
    expect(button.attributes('tabindex')).toBe('-1');
  });

  it('should have correct accessibility attributes when visible', async () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    // Make visible
    window.scrollY = 1400;
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();

    const button = wrapper.find('[data-testid="kofi-button"]');
    expect(button.attributes('aria-hidden')).toBe('false');
    expect(button.attributes('tabindex')).toBe('0');
    expect(button.attributes('aria-label')).toBe('Support me on Ko-fi');
  });

  it('should apply correct position class', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser',
        position: 'bottom-left'
      }
    });

    const button = wrapper.find('[data-testid="kofi-button"]');
    expect(button.classes()).toContain('kofi-bottom-left');
  });

  it('should be visible immediately on short pages', async () => {
    // Simulate short page
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 700, writable: true });

    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    await wrapper.vm.$nextTick();

    const button = wrapper.find('[data-testid="kofi-button"]');
    expect(button.classes()).toContain('kofi-button-visible');
  });

  it('should handle window resize events', async () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    const resizeSpy = vi.spyOn(window, 'addEventListener');

    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();

    // Verify resize listener was attached
    expect(resizeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should clean up event listeners on unmount', () => {
    wrapper = mount(KofiButton, {
      props: {
        kofiUsername: 'testuser'
      }
    });

    const removeSpy = vi.spyOn(window, 'removeEventListener');

    wrapper.unmount();

    // Verify cleanup
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});