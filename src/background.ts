import { browser, Tabs } from 'webextension-polyfill-ts';

let _tabId: number | undefined = 0;
let _oldTabId: number | undefined = 0;

const init = async () => {
  const tabs: Tabs.Tab[] = await browser.tabs.query({ currentWindow:true, active: true});
  if (tabs && tabs.length > 0) {
    _tabId = tabs[0].id;
    _oldTabId = _tabId;
  }
};

const onActive = (info: Tabs.OnActivatedActiveInfoType) => {
  _oldTabId = _tabId;
  _tabId = info.tabId;
};

const onCommand = async (command: string) => {
  if (command === 'activate-latest-tab' && _oldTabId) {
    await browser.tabs.update(_oldTabId, { active: true });
  }
};

// listeners

browser.tabs.onActivated.addListener((info: Tabs.OnActivatedActiveInfoType) => onActive(info));
browser.commands.onCommand.addListener((command: string) => onCommand(command));

init();