import { browser, Commands } from 'webextension-polyfill-ts';

const COMMAND_NAME: string = 'activate-latest-tab';

const onLoaded = async () => {
  const commands: Commands.Command[] = await browser.commands.getAll();
  for (let command of commands) {
    if (command.name === COMMAND_NAME) {
      const inputElement = <HTMLInputElement>document.getElementById('shortcut');
      if (inputElement && command.shortcut) {
        inputElement.value = command.shortcut;
      }
    }
  }

  if ("sidebarAction" in browser) {
    // Firefox only
    const elm = document.getElementById('shortcut-guide');
    if (elm) {
      elm.hidden = true;
    }
  } else {
    // Chrome: not support shortcut key update
    const elm = document.getElementById('form-panel');
    if (elm) {
      elm.hidden = true;
    }
  }
};

const updateShortcut = async () => {
  const inputElement = <HTMLInputElement>document.getElementById('shortcut');
  if ("sidebarAction" in browser) {
    // Firefox only
    await browser.commands.update({
      name: COMMAND_NAME,
      shortcut: inputElement.value
    });
  }
};

const resetShortcut = async () => {
  if ("sidebarAction" in browser) {
    // Firefox only
    await browser.commands.reset(COMMAND_NAME);
  }
  await onLoaded();
}

// listeners

document.addEventListener('DOMContentLoaded', onLoaded);
document.getElementById('update')?.addEventListener('click', updateShortcut);
document.getElementById('reset')?.addEventListener('click', resetShortcut);
